//Importo mongoose
const mongoose = require('mongoose')

const productoSchema = new mongoose.Schema({

    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String, required: true }
},
    { strict: false },
    { timestamps: true }
)

const productosModel = mongoose.model('productos', productoSchema)

module.exports = { productosModel } 