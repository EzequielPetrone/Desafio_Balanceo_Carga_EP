//Importo y configuro el router
const { Router } = require('express')
const apiRouter = Router()

const { CANT_DEFAULT } = require('../config/config') //Importo variable de entorno

const { fork } = require('child_process'); // Importo fork de child_process


// api/randoms calcula nros aleatorios
apiRouter.get('/randoms', (req, res) => {
    
    // Tomamos el query param CANT del request, en caso que no venga o no sea un nro válido uso valor por default (seteado en el .env)
    const qty = Math.abs(parseInt(req.query.cant) || CANT_DEFAULT)
    
    const calculo = fork('./src/subprocesos/calculo') // Creo proceso hijo
    
    calculo.send(qty); // y le envío la cant a iterar
    
    calculo.on('message', result => { // Recibo del proceso hijo el objeto con los resultados del cálculo

        res.type('json').send(JSON.stringify(result, null, 2)) // Uso esta opción de response para que el json se vea formateado
        // res.json(result)
    })
});

module.exports = apiRouter