const bcrypt = require('bcrypt');

function createHash(password) {
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10),
        null
    )
}

function validatePass(user, password) {
    return bcrypt.compareSync(password, user.password)
}

module.exports = { createHash, validatePass }