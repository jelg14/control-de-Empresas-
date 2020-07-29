'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var EmpresaSchema = Schema({
    nombre: String,
    direccion: String,

})

module.exports = mongoose.model('empresa', EmpresaSchema)