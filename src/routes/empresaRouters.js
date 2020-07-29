'use strict'
var express = require("express")
var EmpresaController = require('../controllers/empresaController')
var md_auth = require('../middlewares/authenticated')


//RUTAS TRAZADAS
var api = express.Router();
api.post('/agregar-empresa', EmpresaController.agregarEmpresa)
api.put('/editar-empresa/:Id', md_auth.ensureAuth, EmpresaController.editarEmpresa)
api.delete('/eliminar-empresa/:Id', md_auth.ensureAuth, EmpresaController.eliminarEmpresa)
api.get('/ver-empresas', EmpresaController.verEmpresas)
api.get('/login-empresa', EmpresaController.loginEmpresa)
    //------CRUD Sucursales
api.post('/agregar-sucursal', md_auth.ensureAuth, EmpresaController.agregarSucursal)
api.put('/editar-sucursal/:IdSucursal', md_auth.ensureAuth, EmpresaController.editarSucursal)
api.get('/listar-sucursales', EmpresaController.listarSucursal)
api.delete('/eliminar-sucursal/:IdSucursal', md_auth.ensureAuth, EmpresaController.eliminarSucursal)
    //-----PRODUCTOS
api.post('/agregar-producto', md_auth.ensureAuth, EmpresaController.agregarProducto)
api.get('/producto-disponible-empresa/:idEmpresa', md_auth.ensureAuth, EmpresaController.listarProductoCantidadEmpresa)
api.get('/nombre-producto-empresa', md_auth.ensureAuth, EmpresaController.listarNombreProductoEmpresa)
api.put('/distribuir-producto/:id', md_auth.ensureAuth, EmpresaController.distribuirProducto)
api.put('/editar-producto/:id', md_auth.ensureAuth, EmpresaController.editarProducto)
api.get('/listar-producto-cantidad-sucursal/:idSucursal', md_auth.ensureAuth, EmpresaController.listarProductoCantidadSucursal)
module.exports = api;