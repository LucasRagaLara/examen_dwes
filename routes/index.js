var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const {insertarDatos, obtenerDatosUsuario, obtener_colecciones, buscarColeccion, actualizarColeccion, borrarColeccion, anadirColeccion} = require('./conexionbd')

let visitas = 0

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/coleccion', async (req, res) => {
  console.log("entra aquí")
  const token = req.cookies.id
  const id = jwt.verify(token, process.env.SECRETO)
  const colecciones = await obtener_colecciones(id)
  console.log(colecciones)
  if (colecciones){
    res.render('coleccion', {colecciones: colecciones})
  }else{
    res.render('coleccion', {colecciones: false})
  }
})

router.post('/actualizar', async (req, res) => {
  const {id_actualizar, descripcion, foto} = req.body
  await actualizarColeccion({id: id_actualizar, descripcion: descripcion, foto: foto})
  res.redirect('/perfil')
})

router.post('/borrar', async (req, res) => {
  const {id_borrar} = req.body 
  await borrarColeccion(id_borrar)
  res.redirect('/perfil')
})

router.post('/editar', async (req, res) => {
  const {id_actualizar} = req.body
  const buscar_coleccion = await buscarColeccion(id_actualizar)
  console.log(buscar_coleccion)
  res.render('actualizar', {coleccion: buscar_coleccion})
})

router.get('/anadir', async (req, res) => {
  res.render('anadir')
})

router.post('/anadirColeccion', async (req, res) => {
  const {foto, descripcion} = req.body
  const token = req.cookies.id
  const id = jwt.verify(token, process.env.SECRETO)
  console.log(id)
  await anadirColeccion(foto, descripcion, id)
  res.redirect('/perfil')
})

router.get('/registro', async(req, res) => {
  res.render('registro')
})

router.get('/login', async(req, res) => {
  res.render('login')
})

router.get('/perfil', async (req, res) => {
  const token = req.cookies.id
  const id = jwt.verify(token, process.env.SECRETO)
  const datos = await obtenerDatosUsuario(id)
  const nombre = datos[0].nombre
  const usuario_datos = {
    nombre: nombre,
    visitas: visitas
  }
  visitas += 1
  res.render('perfil', {usuario_datos: usuario_datos})
})

router.post('/init', async (req, res) => {
  const datos = require('../data/datos.json')
  for (let dato of datos){
    await insertarDatos(dato)
  }
  res.send('Done!')
})

module.exports = router;