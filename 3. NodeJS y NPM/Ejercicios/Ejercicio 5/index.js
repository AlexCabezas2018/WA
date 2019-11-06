
const http = require('http');
const url = require('url');
const DAO = require("./dao");
const fs = require("fs");

let dao = new DAO('localhost', 'root', '', 'AW_Exercises');

// Establecimiento de la función callback del servidor
let servidor = http.createServer((request, response) => {
   let method = request.method;
   let pathName = request.pathName;

   if(method === "GET"){
       switch(pathName){
            case "/index.html":
               break;
            case "/nuevo_usuario":
                break;
       }
   }

   /** TODO:
    *   1- Si el método es get: X
    *       1.1 Si el pathName es /index.html X
    *           1.1.1 Cargarlo con fs (controlar si ha leido el archivo correctamente)
    *           1.1.2 Mandarlo
    *           1.1.3 Terminar comunicación
    *       1.2 Si el pathName es /nuevo_usuario
    *           1.2.1 Obtener los parametros
    *           1.2.2 Convertirlos a objetos con url
    *           1.2.3 Añadirlos a la bd con el dao
    *           1.2.4 Terminar comunicación
    *       1.3 Si es un path distinto pasamos de el
    *   2- Si es otro método error
    */
});

// Inicio del servidor
servidor.listen(3000, function(err) {
    if (err) {
        console.log(`Error al abrir el puerto 3000: ${err}`);
    } else {
        console.log("Servidor escuchando en el puerto 3000.");
    }
});