'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var EmpleadoSchema = Schema({
    nombre: String,
    puesto: String,
    departamento: String,
    empresaId: { type: Schema.ObjectId, ref: 'empresa' }

})

module.exports = mongoose.model('empleado', EmpleadoSchema);