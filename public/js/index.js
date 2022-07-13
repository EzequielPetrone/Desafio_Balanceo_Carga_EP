//Me conecto
const socket = io();

/*
document.addEventListener("DOMContentLoaded", () => {

    //Instancio elemento del DOM que quiero manipular
    const alert = document.querySelector('#serverAlert')
    socket.on('connect', () => alert.style.display = 'none')
    //En caso que el server se caiga: Lanzo alerta (que cuando se reconecta desaparece obviamente)
    socket.on('disconnect', () => alert.style.display = 'block')
})
*/