
const http = require('http');
const url = require('url');
const DAO = require("./dao");
const fs = require("fs");

let dao = new DAO('localhost', 'root', '', 'AW_Exercises');

// Establecimiento de la función callback del servidor
let servidor = http.createServer((request, response) => {
   let method = request.method;
   let urlObject=url.parse(request.url,true);
   let pathName = urlObject.pathname;   
   console.log(method, pathName);
   if(method === "GET"){
       switch(pathName){
            case "/index.html":
                fs.readFile("./index.html",(err,content)=>{
                    if(err) {
                        response.statusCode = 500;
                        response.setHeader("Content-Type", "text/html");
                        response.write("ERROR INTERNO");
                        response.end();
                    }
                    else {
                        response.statusCode = 200;
                        response.setHeader("Content-Type", "text/html");
                        response.write(content);
                        response.end();
                    }              
                });
               break;
            case "/index.css":
                    fs.readFile("./index.css",(err,content)=>{
                        if(err) {
                            response.statusCode = 500;
                            response.setHeader("Content-Type", "text/css");
                            response.write("ERROR INTERNO");
                            response.end();
                        }
                        else {
                            response.statusCode = 200;
                            response.setHeader("Content-Type", "text/css");
                            response.write(content);
                            response.end();
                        }              
                    });
            case "/nuevo_usuario":
                    let user=urlObject.query;
                    dao.insertarUsuario(user,err=>{
                        if(err) console.log(err.message);
                        else{
                            console.log("Usuario insertado correctamente");
                        }
                    });
                break;
       }
   }
});

// Inicio del servidor
servidor.listen(3000, function(err) {
    if (err) {
        console.log(`Error al abrir el puerto 3000: ${err}`);
    } else {
        console.log("Servidor escuchando en el puerto 3000.");
    }
});