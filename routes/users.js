var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const {insertarUsuario, comprobarUsuario, obtenerDatosUsuario} = require('./conexionbd')
const jwt = require('jsonwebtoken');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/registrado', async (req, res) => {
  console.log("entra en registrado")
  const {nombre, correo, password} = req.body;
  const password_hash = await bcrypt.hash(password, 10)
  const obtener_usuario = await insertarUsuario({nombre: nombre, correo: correo, password: password_hash})
  console.log(obtener_usuario)
  if (obtener_usuario){
    console.log(obtener_usuario)
    const token = jwt.sign(obtener_usuario[0].id, process.env.SECRETO)
    const token_desencriptado = jwt.verify(token, process.env.SECRETO)
    res.cookie('id', token)
    console.log(token)
    if (parseInt(token_desencriptado) == 1){
      const admin = await obtenerDatosUsuario(token_desencriptado, process.env.SECRETO)
      res.redirect('/panel', {admin: admin})
    }else{
      res.redirect('/perfil')
    }
  }else{
    res.redirect('/login')
  }
});

router.post('/logueado', async (req, res) => {
  console.log("entra en login")
  const {correo, password} = req.body
  const comprobar = await comprobarUsuario({correo: correo, password: password})
  if (comprobar){
    const token = jwt.sign(comprobar[0].id, process.env.SECRETO)
    res.cookie('id', token)
    res.redirect('/perfil')
  }else{
    res.redirect('/registro')
  }
})


module.exports = router;
