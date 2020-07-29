'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var SucursalSchema = new Schema({
    ubicacion: String,
    telefono: String,
    productos: [],
    empresaId: { type: Schema.ObjectId, ref: 'empresa' },
    empleadoId: { type: Schema.ObjectId, ref: 'empleado' }
});

module.exports = mongoose.model('sucursal', SucursalSchema);