'use strict'
//INPORTS
var Empleado = require('../models/empleado')
var PDF = require('pdfkit')
var fs = require('fs')

function registrarEmpleado(req, res) {
    var empleado = new Empleado();
    var params = req.body


    if (params.nombre && params.puesto && params.departamento && params.empresaId) {
        empleado.nombre = params.nombre;
        empleado.puesto = params.puesto;
        empleado.departamento = params.departamento;
        empleado.empresaId = params.empresaId


        empleado.save((err, empleadoContratado) => {

            if (err) return res.status(500).send({ message: 'Error al registar empleado' })
            if (empleadoContratado) {
                return res.status(200).send({ Empleado_nuevo: empleadoContratado })

            } else {
                return res.status(404).send({ message: 'No se ha podido registrar empleado' })
            }
        })

    } else {
        return res.status(500).send({ message: 'rellene todos los datos correspondientes' })
    }
}



function editarEmpleado(req, res) {
    var empleadoId = req.params.id
    var params = req.body;

    if (params.empresaId) {
        return res.status(500).send({ message: 'No puede cambiarlo de empresa' })
    }

    Empleado.findByIdAndUpdate(empleadoId, params, { new: true }, (err, empleadoActualizar) => {

        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!empleadoActualizar) return res.status(404).send({ message: 'no se ha podido editar el empleado' })
        return res.status(200).send({ empleado: empleadoActualizar })
    })
}

function eliminarEmpleado(req, res) {
    var empleadoId = req.params.id

    Empleado.findByIdAndDelete(empleadoId, (err, empleadoEliminar) => {
        console.log(err)
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!empleadoEliminar) return res.status(404).send({ message: 'no se ha podido eliminar el empleado' })

        return res.status(200).send({ empleadoEliminado: empleadoEliminar })

    })
}

function numeroEmpleados(req, res) {

    var empresaId = req.params.Id

    Empleado.count({ empresaId: empresaId }, (err, empleados) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" })

        return res.status(200).send({ EmpleadosDisponibles: empleados })
    })
}

function buscarEmpleado(req, res) {
    var empleadoId = req.params.idEmpleado


    Empleado.findById(empleadoId, (err, datosDelEmpleado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!datosDelEmpleado) return res.status(404).send({ message: 'No es posible acceder a los datos del empleado' })

        return res.status(200).send({ Datos_del_empleado: datosDelEmpleado })
    })
}

function buscarEmpleadoNombre(req, res) {
    var nombre = req.body.nombre

    Empleado.find({ nombre: { $regex: nombre, $options: 'i' } }).exec((err, nombres) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        return res.status(200).send({ Coincidencias: nombres })

    })
}

function buscarEmpleadoPuesto(req, res) {
    var puesto = req.body.puesto

    Empleado.find({ puesto: { $regex: puesto, $options: 'i' } }).exec((err, nombres) => {
        if (err) res.status(500).send({ message: 'Error en la peticion' })

        return res.status(200).send({ Coincidencias: nombres })

    })
}

function buscarEmpleadoDepartamento(req, res) {
    var departamento = req.body.departamento

    Empleado.find({ departamento: { $regex: departamento, $options: 'i' } }).exec((err, nombres) => {
        if (err) res.status(500).send({ message: 'Error en la peticion' })

        return res.status(200).send({ Coincidencias: nombres })

    })
}

function buscarEmpleados(req, res) {
    Empleado.find({}, (err, listaDeEmpleados) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        return res.status(200).send({ Lista_empleados: listaDeEmpleados })
    })
}

function exportar_pdf(req, res) {
    var document = new PDF()
    var empleado = new Empleado()
    document.pipe(fs.createWriteStream(__dirname + '/empleados.pdf'))
    document.text(empleado.nombre, {
        align: center
    })
}
module.exports = {
    registrarEmpleado,
    editarEmpleado,
    eliminarEmpleado,
    numeroEmpleados,
    buscarEmpleado,
    buscarEmpleados,
    buscarEmpleadoNombre,
    buscarEmpleadoPuesto,
    buscarEmpleadoDepartamento,
    exportar_pdf
}