'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'clave_secreta_2018169'

exports.createToken = function(empresa) {

    var payload = {
        sub: empresa._id,
        nombre: empresa.nombre,
        direccion: empresa.direccion,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix()
    }
    return jwt.encode(payload, secret)
}