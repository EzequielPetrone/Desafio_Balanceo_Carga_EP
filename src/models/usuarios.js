const mongoose = require('mongoose');
const { MONGO_URL } = require('../config/config')

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  name: { type: String, required: true, max: 100 }
})

module.exports = mongoose.model('usuarios', UsuarioSchema)