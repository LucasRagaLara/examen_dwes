const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs')


const pool = mysql.createPool({
    database: process.env.DATABASE,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
})

const insertarDatos = async(dato) => {
    await pool.execute("INSERT INTO objetos (foto, descripcion, id_usuario) VALUES (?,?,?)", [dato.foto, dato.descripcion, dato.id_usuario])
}

const insertarUsuario = async (usuario) => {
    console.log(usuario)
    const [comprobar] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [usuario.correo])
    console.log("dato comprobar", comprobar)
    if (comprobar && comprobar.length > 0){
        return false;
    }else{
        await pool.execute("INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)", [usuario.nombre, usuario.correo, usuario.password])
        const [obtener_usuario] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [usuario.correo])
        console.log(obtener_usuario)
        return obtener_usuario
    }
}

const comprobarUsuario = async (usuario) => {
    console.log("entra aquí")
    const [comprobar] = await pool.query("SELECT * from usuarios WHERE correo = ?", [usuario.correo])
    if (comprobar && comprobar.length > 0){
        const verificar = await bcrypt.compare(usuario.password, comprobar[0].password)
        console.log(verificar)
        if (verificar){
            return comprobar
        }else{
            return false
        }
    }else{
        return false
    }
}

const obtenerDatosUsuario = async (id) => {
    const [usuario] = await pool.query("SELECT * from usuarios where id = ?", [id])
    return usuario
}

const obtener_colecciones = async (id) => {
    const [colecciones] = await pool.query("SELECT * from objetos where id_usuario = ?", [id])
    if (colecciones && colecciones.length > 0){
        return colecciones 
    } else {
        return false
    }
}

const buscarColeccion = async (id) => {
    const [datos] = await pool.query("SELECT * from objetos where id = ?", [id])
    return datos
}

const actualizarColeccion = async (colect) => {
    await pool.execute("UPDATE objetos SET foto = ?, descripcion = ? where id = ?", [colect.foto, colect.descripcion, colect.id])
}

const borrarColeccion = async (id) => {
    await pool.execute("DELETE FROM objetos WHERE id = ?", [id])
}

const anadirColeccion = async (foto, descripcion, id) => {
    await pool.execute("INSERT INTO objetos (foto, descripcion, id_usuario) VALUES (?, ?, ?)", [foto, descripcion, id])
}

module.exports = {
    insertarUsuario,
    comprobarUsuario,
    obtenerDatosUsuario,
    insertarDatos,
    obtener_colecciones,
    buscarColeccion,
    actualizarColeccion,
    borrarColeccion,
    anadirColeccion
}