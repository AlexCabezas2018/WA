
const http = require('http');
const url = require('url');
const DAO = require("./dao");

let dao = new DAO('localhost', 'root', '', 'AW_Exercises');

// Establecimiento de la función callback del servidor
let servidor = http.createServer((request, response) => {
   
});

// Inicio del servidor
servidor.listen(3000, function(err) {
    if (err) {
        console.log(`Error al abrir el puerto 3000: ${err}`);
    } else {
        console.log("Servidor escuchando en el puerto 3000.");
    }
});