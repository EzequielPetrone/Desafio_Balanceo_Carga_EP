//Tratamiento del submit de un nuevo producto al server
const prodForm = document.querySelector('#prodForm')

prodForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const check = await (await fetch('/checkAuth')).json()

    if (check.auth) {
        let body = new FormData(prodForm)
        const prod = {
            title: body.get('productTitle'),
            price: parseFloat(body.get('productPrice')), //Necesario convertir a Number
            thumbnail: body.get('productImgUrl')
        }
        socket.emit('NEWPROD', prod);
        prodForm.reset()

    } else {
        alert('Su sesión ha expirado!')
        location.reload();
    }
})

//Renderizo actualización del listado de productos
const prodList = document.querySelector('#prodList')

socket.on('PRODLIST', async (data) => {
    const template = Handlebars.compile(await (await fetch('../views/tableProd.hbs')).text());
    prodList.innerHTML = template({ productos: data })
})