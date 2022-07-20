// ESTE CÓDIGO ES PARA EL USO CON PM2 (con FOREVER también puede aplicar), ES EL CÓDIGO ORIGINAL SIN CLUSTERING MANUAL

//Importo dependencias varias
const express = require('express');
const { createServer } = require("http")
const { Server } = require("socket.io")
const session = require('express-session');
const handlebars = require('express-handlebars');
const passport = require('passport');

const { PORT, EXP_TIME } = require('./src/config/config') //Importo variables de config

//Importo y seteo contenedor de productos
const { ProductosDaoMongo } = require('./src/daos/productos/ProductosDaoMongo');
const contenedorProd = new ProductosDaoMongo()

//Configuro Express app, server http y socket
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.disable('x-powered-by'); // un pequeño seteo de seguridad

//Seteo HBS views
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + "/src/views/layouts",
        partialsDir: __dirname + "/src/views/partials/",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        }
    })
);
app.set('view engine', 'hbs');
app.set('views', './src/views');

//Seteo 'public' como static
app.use(express.static(__dirname + "/public"));

//Configuro Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err });
})

//Configuro session e inicializo passport
app.use(session({
    secret: 'clave_test_eze',
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: EXP_TIME
    },
    rolling: true,
    resave: true,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//Seteo Routers
const apiRouter = require('./src/routes/apiRouter');
app.use('/api', apiRouter)
const router = require('./src/routes/routes');
app.use('/', router)

//Gestiono conexión con socket clients
io.on('connection', async (socket) => {

    //Envío al nuevo socket los productos registrados al momento
    socket.emit('PRODLIST', await contenedorProd.getAll())

    //Recibo, guardo y retransmito Productos
    socket.on('NEWPROD', async (data) => {
        try {
            let newId = await contenedorProd.saveProducto(data)
            if (newId) {
                io.sockets.emit('PRODLIST', await contenedorProd.getAll());
            } else {
                throw 'Error al guardar nuevo producto'
            }
        } catch (error) {
            console.log(error);
        }
    });
});

//Socket.io Error logging
io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
});

//Pongo a escuchar al server
httpServer.listen(PORT, err => {
    if (!err) {
        console.log(`Server running. PORT: ${httpServer.address().port}`)
    }
});

//Server Error handling
httpServer.on("error", error => console.log('Error en el servidor:', error))
