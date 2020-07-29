'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

var ProductoSchema = Schema({
    producto: String,
    cantidadDisponible: Number,
    empresaId: { type: Schema.ObjectId, ref: 'empresa' },
    sucursalId: { type: Schema.ObjectId, ref: 'sucursal' }
});

module.exports = mongoose.model('producto', ProductoSchema)