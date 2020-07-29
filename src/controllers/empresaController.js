'user strict'

var Empresa = require('../models/empresa')
var Empleado = require('../models/empleado')
var Producto = require('../models/producto')
var Sucursal = require('../models/sucursal')
var jwt = require('../services/jwt')

// -----------------------------------------------FUNCIONES PARA CONTROL CURSOS DE MAESTRO
function agregarEmpresa(req, res) {
    var empresa = new Empresa()
    var params = req.body

    if (params.nombre && params.direccion) {
        empresa.nombre = params.nombre,
            empresa.direccion = params.direccion;

        Empresa.find({ $or: [{ nombre: empresa.nombre }] }).exec((err, empleados) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de empleados' })
            if (empleados && empleados.length >= 1) {
                console.log(empleados.length)
                return res.status(500).send({ message: 'Ya existe una empresa registrada con ese nombre' })
            } else {
                empresa.save((err, empresaGuardado) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion de Empresa' })
                    if (!empresaGuardado) res.status(404).send({ message: 'Error al agregar Empresa' })

                    return res.status(200).send({ Empresa: empresaGuardado })
                })
            }
        })
    } else {
        res.status(200).send({ message: 'Rellene todos los datos necesarios' })
    }
}



function editarEmpresa(req, res) {
    var empresaId = req.params.Id
    var params = req.body

    Empresa.findByIdAndUpdate(empresaId, params, { new: true }, (err, empresaActualizado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (!empresaActualizado) return res.status(404).send({ message: 'La empresa no fue encontrada' })

        return res.status(200).send({ Empresa: empresaActualizado })
    })
}

function eliminarEmpresa(req, res) {
    var empresaId = req.params.Id
    console.log(empresaId)

    Empresa.findByIdAndDelete(empresaId, (err, empresaEliminado) => {

        if (err) return res.status(500).send({ message: 'error en la peticion' })
        if (!empresaEliminado) return res.status(404).send({ message: 'no se ha podido eliminar la empresa' })
        Empleado.deleteMany({ empresaId: empresaId }, (err, empresaEliminado) => {
            Sucursal.deleteMany({ empresaId: empresaId }, (err, empresaEliminado) => {
                return res.status(200).send({ EmpresaEliminada: empresaEliminado })
            })
        })
    })
}

function verEmpresas(req, res) {
    Empresa.find({}, (err, empresas) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })
        return res.status(200).send({ Empresas: empresas })
    })
}

function loginEmpresa(req, res) {
    var params = req.body

    Empresa.findOne({ nombre: params.nombre }, (err, empresa) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        if (empresa) {
            if (params.gettoken) {
                return res.status(200).send({
                    token: jwt.createToken(empresa)
                })
            } else {
                return res.status(200).send({ user: usuario });
            }
        } else {
            return res.status(404).send({ message: 'no se ha podido loguear' })
        }
    })
}

//-------------------------------CREACION SUCURSALES

function agregarSucursal(req, res) {
    var sucursal = new Sucursal()
    var params = req.body

    if (params.ubicacion && params.telefono) {
        sucursal.ubicacion = params.ubicacion,
            sucursal.telefono = params.telefono,
            sucursal.empresaId = req.user.sub

        sucursal.save((err, sucursalGuardada) => {
            if (err) return res.status(500).send({ message: 'Error al guardar Sucursal' })

            return res.status(200).send({ Nueva_sucursal: sucursalGuardada })
        })

    } else {
        return res.status(500).send({ message: 'Rellene todos los datos correspondientes' })
    }
}

function editarSucursal(req, res) {
    var params = req.body
    var sucursalId = req.params.IdSucursal

    if (req.params.empresaId) {
        return res.status(500).send({ message: 'No puede cambiar de empresa a la sucursal' })
    }
    Sucursal.findById(sucursalId, (err, sucursales) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        if (req.user.sub != sucursales.empresaId) {
            return res.status(500).send({ message: 'La sucursal no le pertenece' })
        } else {
            Sucursal.findByIdAndUpdate(sucursalId, params, (err, sucursalActualizada) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion de actualizar ' })

                return res.status(200).send({ Sucursal: sucursalActualizada })
            })
        }
    })

}

function eliminarSucursal(req, res) {
    var sucursalId = req.params.IdSucursal

    if (req.params.empresaId) {
        return res.status(500).send({ message: 'No puede cambiar de empresa a la sucursal' })

    }
    console.log(sucursalId)
    Sucursal.findById(sucursalId, (err, sucursales) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        if (req.user.sub != sucursales.empresaId) {
            return res.status(500).send({ message: 'La sucursal no le pertenece' })
        } else {
            Sucursal.findByIdAndDelete(sucursalId, (err, sucursalEliminada) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion de actualizar ' })

                return res.status(200).send({ Sucursal: sucursalEliminada })
            })
        }
    })
}

function listarSucursal(req, res) {
    var idEmpresa = req.body.id

    Sucursal.find({ empresaId: idEmpresa }).exec((err, sucursales) => {

        console.log(idEmpresa)
        if (err) return res.status(500).send({ message: 'Error en la peticion' + err })

        return res.status(200).send({ sucursalesDisponibles: sucursales })

    })
}


//-------------------------------FUNCIONES PARA PRODUCTOS

function agregarProducto(req, res) {
    var params = req.body
    const producto = new Producto()

    if (params.nombre && params.cantidadDisponible) {
        producto.producto = params.nombre,
            producto.cantidadDisponible = params.cantidadDisponible,
            producto.empresaId = req.user.sub;

        Producto.find({
            $or: [{ producto: producto.producto }]
        }).exec((err, productos) => {
            if (err) return res.status(500).send({ message: 'Error en la produccion' })
            console.log(productos)
            if (productos && productos.length >= 1) {
                Producto.find({ $or: [{ producto: producto.producto }] }).update({ $inc: { cantidadDisponible: params.cantidadDisponible } }, (err, producto) => {
                    if (err) return res.status(500).send({ message: 'Error en la peticion ' + err })

                    return res.status(200).send({ producto: producto })
                })
            } else {
                producto.save((err, productoNuevo) => {
                    if (err) return res.status(500).send({ message: 'Error en la produccion' })
                    return res.status(200).send({ Producto: productoNuevo })
                })
            }
        })
    } else {

    }
}



function distribuirProducto(req, res) {
    var idSucursal = req.params.id
    var params = req.body
    var producto = params.producto
    var cantidad = params.cantidadDisponible
    var productoId = params.productoId
    var validar = true
    var productoExistente = false;

    if (cantidad >= 0) {
        Sucursal.findByIdAndUpdate(idSucursal, { new: true }, (err, sucursalEncontrada) => {
            if (err) return res.status(500).send({ message: 'error en la peticion de busqueda de sucursal' })
            if (!sucursalEncontrada) return res.status(404).send({ message: 'La sucursal que busca no esta disponible' })

            Producto.findById(productoId, (err, productoEncontrado) => {
                if (err) return res.status(500).send({ message: 'error en la peticion de busqueda de producto' })
                if (!productoEncontrado) {
                    validar = false;
                    return res.status(404).send({ message: 'el producto no existe' })
                }

                if (productoEncontrado) {

                    if (producto.cantidadDisponible < 0 && producto.cantidadDisponible > cantidad) {
                        validar = false;
                        productoExistente = false;
                    } else {
                        validar = true;
                    }

                }
            })

            if (validar == true) {
                if (productoExistente == true) {
                    sucursalEncontrada.productos.aggregate([{ $group: { _id: { productoId }, producto: { producto }, cantidad: { $inc: cantidad } } }], (err, productoSucursal) => {
                        if (err) return res.status(500).send({ message: 'Error en la peticion de agregar mas productos' })
                        return res.status(200).send({ productos: productoSucursal })
                    })

                } else {
                    Producto.findById(productoId, (err, productos) => {
                        if (productos.cantidadDisponible > 0 && productos.cantidadDisponible > cantidad) {
                            Sucursal.find()
                            sucursalEncontrada.productos.push({ producto: producto, cantidad: cantidad, idProducto: productoId });
                            sucursalEncontrada.save();
                            Producto.findByIdAndUpdate(productoId, { $inc: { cantidadDisponible: params.cantidadDisponible * -1 } }, (err, producto) => {})
                        }
                    })
                }
            } else {
                return res.status(500).send({ message: 'No hay unidades disponibles para la sucursal' })
            }

            return res.status(200).send({ sucursal: sucursalEncontrada })

        })
    } else {
        return res.status(500).send({ message: 'favor de ingresar Una cantidad superior a 50' })
    }

}

function editarProducto(req, res) { //pendiente
    var productoId = req.params.id
    var params = req.body
    var nombre = params.producto

    Producto.findByIdAndUpdate(productoId, params, { new: true }, (err, productoActualizado) => {
        if (err) return res.status(500).send({ message: 'Error al realizar la solicitud' })
        if (!productoActualizado) return res.status(404).send({ message: 'No fue posible encontrar el producto' })

        productoActualizado.productos.updateMany({ _id: productoId }, { set: { "producto.$": nombre } }, (err, productoActualizado) => {
            return res.status(200).send({ Actualizacion: productoActualizado })
        })
    })
}

function listarProductoCantidadEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa

    Producto.find({ empresaId: idEmpresa }, { cantidadDisponible: { $all: [] } }, (err, productos) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })
        console.log(productos)

        return res.status(200).send({ Cantidad_de_productos: productos })
    })
}

function listarProductoCantidadSucursal(req, res) {
    var idSucursal = req.params.idSucursal
    Sucursal.findById(idSucursal, (err, sucursal) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })

        sucursal.productos.find({ cantidad: { $all: [] } }, (err, producto) => {
            if (err) return res.status(500).send({ message: 'error en la peticion' })

            return res.status(200).send({ CantidadDisponible: producto })
        })
    })
}

function listarNombreProductoEmpresa(req, res) {
    var producto = req.body.producto

    Producto.find({ producto: { $regex: producto, $options: 'i' } }).exec((err, productos) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })

        return res.status(200).send({ Coincidencias: productos })

    })
}

function listarNombreProductoSucursal(req, res) {
    var producto = req.body.producto

    Sucursal.find({ productos: { $regex: producto, $options: 'i' } }).exec((err, productos) => {
        if (err) return res.staturs(500).send({ message: 'error en la peticion' })

        return res.status(200).send({ Coincidencias: productos })
    })
}

module.exports = {
    agregarEmpresa,
    editarEmpresa,
    eliminarEmpresa,
    verEmpresas,
    loginEmpresa,
    agregarSucursal,
    editarSucursal,
    listarSucursal,
    eliminarSucursal,
    agregarProducto,
    listarProductoCantidadEmpresa,
    listarNombreProductoEmpresa,
    distribuirProducto,
    listarProductoCantidadSucursal,
    listarNombreProductoSucursal,
    editarProducto
}