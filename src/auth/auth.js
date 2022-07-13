const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; //Importo passport-local

const UserModel = require('../models/usuarios'); //Importo el modelo de ususarios mongo

const { validatePass, createHash } = require('../utils/password'); //Importo funciones útiles basadas en bcrypt

//Defino estrategias passport
passport.use('login', new LocalStrategy({ usernameField: 'email' },
    (email, password, callback) => {
        UserModel.findOne({ email: email }, (err, user) => {
            if (err) {
                console.log('Hay un error al loguearse');
                return callback(err)
            }

            if (!user) {
                // console.log('No se encontro usuario');
                return callback(null, false, { msg: 'No se encontro usuario' })
            }

            if (!validatePass(user, password)) {
                // console.log('Invalid Password');
                return callback(null, false, { msg: 'Invalid Password' })
            }

            return callback(null, user)
        })
    }
))

passport.use('signup', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
    (req, email, password, callback) => {
        UserModel.findOne({ email: email }, (err, user) => {
            if (err) {
                console.log('Hay un error al registrarse');
                return callback(err)
            }

            if (user) {
                // console.log('El usuario ya existe');
                return callback(null, false, { msg: 'El usuario ya existe' })
            }

            const newUser = {
                email: email,
                password: createHash(password),
                name: req.body.name
            }

            UserModel.create(newUser, (err, userWithId) => {
                if (err) {
                    // console.log('Hay un error al registrarse');
                    return callback(err)
                }

                // console.log('Registro de usuario satisfactoria');
                return callback(null, userWithId)
            })
        })
    }
))

passport.serializeUser((user, callback) => {
    callback(null, user._id)
})

passport.deserializeUser((id, callback) => {
    UserModel.findById(id, callback)
})


module.exports = { passport }