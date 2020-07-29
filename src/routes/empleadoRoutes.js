'use strict'

var express = require("express")
var EmpleadoController = require("../controllers/empleadoController")


//RUTAS TRAZADAS

var api = express.Router();
api.post('/registrar-empleado', EmpleadoController.registrarEmpleado)
api.put('/editar-empleado/:id', EmpleadoController.editarEmpleado)
api.delete('/eliminar-empleado/:id', EmpleadoController.eliminarEmpleado)
api.get('/numeroEmpleados/:Id', EmpleadoController.numeroEmpleados)
api.get('/buscar-empleado/:idEmpleado', EmpleadoController.buscarEmpleado)
api.get('/buscar-empleados', EmpleadoController.buscarEmpleados)
api.get('/buscar-empleados-nombres', EmpleadoController.buscarEmpleadoNombre)
api.get('/buscar-empleados-puesto', EmpleadoController.buscarEmpleadoPuesto)
api.get('/buscar-empleados-departamento', EmpleadoController.buscarEmpleadoDepartamento)
module.exports = api;