'use strict'

//VARIABLES GLOBALES   
const express = require("express")
const app = express()
const bodyparser = require("body-parser")

//CARGAR RUTAS
var empleado_routes = require("./routes/empleadoRoutes")
var empresa_routes = require("./routes/empresaRouters")

//MIDDLEWARES  
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json());

//CABECERAS (Peticiones HTTP)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')

    next();
})

//RUTAS
app.use('/api', empleado_routes)
app.use('/api', empresa_routes)

module.exports = app;