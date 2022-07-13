process.on('message', qty => { 

    const obj = {}

    for (let index = 0; index < qty; index++) { // El proceso hijo recibe del padre la qty a iterar

        const nro = Math.floor(Math.random() * 1000) + 1 // Genero nro entero aleatorio entre 1 y 1000

        if (obj[nro]) {
            obj[nro] += 1 // Si ya existe dentro del objeto ese nro como key, incremento su value
        } else {
            obj[nro] = 1 // sino creo ese nro como key y le asigno value 1
        }
    }

    process.send(obj) // Devuelvo al proceso padre el objeto calculado

    process.exit() // Mato al proceso hijo luego de que haga su trabajo
})