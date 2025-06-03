const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.post('/login', (req, res) =>{
    const {username, password} = req.body;
    const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?';

    db.query(sql, [username, password], (err, resultados) => {
        if (err) throw err;

        console.log(resultados);

        if (resultados.length > 0){
            res.send('Inicio de sesión exitoso');
        } else {
            res.send('Credenciales incorrectas');
        }
    });
});

app.post('/signin', (req, res) =>{
    const {usernameSign, passwordSign} = req.body;
    const sql = 'SELECT * FROM usuarios WHERE usuario = ?';

    db.query(sql, [usernameSign], (err, resultados) => {
        if (err) throw err;

        console.log(resultados);

        if (resultados.length > 0){
            res.send('Ya existe un usuario con ese nombre.');
        } else {
            const insertUser = "INSERT INTO usuarios(usuario, contrasena) VALUES (?,?)"
            db.query(insertUser, [usernameSign, passwordSign], (err, resultados)=>{
                if (err) throw err;

                if (resultados.affectedRows > 0){
                    res.send('Usuario registrado exitosamente');
                } else {
                    res.send('Error al registrar el usuario');
                }
            });
        }
    });
});

app.listen(3000, ()=>{
    console.log('Servidor corriendo en http://localhost:3000');
});