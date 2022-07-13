//Importo y configuro el router
const express = require('express')
const router = express.Router()

//Para leer bien los req.body
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const { passport } = require('../auth/auth') //Importo mi passport ya configurado

const { PROCESS_INFO } = require('../config/config') //Importo objeto con info del Node process

//  INDEX
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('main', { username: req.user.name })
    } else {
        res.redirect('/login');
    }
});

//  LOGIN
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        res.render('login');
    }
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/' }));

router.get('/faillogin', (req, res) => res.render('login-error', {}));

/*
router.post('/login', function(req, res, next ){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) { return res.json( { message: info.message }) }
      res.json(user);
    })(req, res, next);   
});
*/

//  SIGNUP
router.get('/signup', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        res.render('signup');
    }
});

router.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup', successRedirect: '/' }));

router.get('/failsignup', (req, res) => res.render('signup-error', {}));

//  LOGOUT
router.get('/logout', (req, res) => {
    let usuario = ''
    if (req.isAuthenticated()) {
        usuario = req.user.name
    }
    req.logout((err) => {
        if (!err) {
            res.render('logout', { username: usuario });
        } else {
            res.redirect('/');
        }
    })
});

// check if logged
router.get('/checkAuth', (req, res) => res.json({ auth: req.isAuthenticated() }));

// INFO
router.get('/info', (req, res) => {
    // Le agrego al objeto con los datos del node process el uso de memoria total (rss)
    // ya que es el único dato que vale la pena obtenerlo en tiempo real al momento del request
    // el resto de la data siempre es la misma una vez iniciado el server
    PROCESS_INFO.rss = process.memoryUsage().rss

    // Esta vista la dejé como un JSON formateado, si llego a tener tiempo le diseño un html...
    res.type('json').send(JSON.stringify(PROCESS_INFO, null, 2))
    // res.json(PROCESS_INFO)
});

//  FAIL ROUTE
router.use('*', (req, res) => res.status(404).render('routing-error', { originalUrl: req.originalUrl, method: req.method }));


module.exports = router