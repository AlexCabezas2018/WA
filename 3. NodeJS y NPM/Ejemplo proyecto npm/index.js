"use strict"

const fs = require("fs");

// try {
//     const contenido = fs.readFileSync("FicheroTexto.txt", {encoding: "utf-8"});
//     console.log("Fichero leido correctamente");
//     console.log(contenido);
// } catch(error) {
//     console.log("Se ha producido un error");
//     console.log(error.message);
// }

fs.readFile("FicheroTexto.txt", {encoding: "utf-8"}, 
(err, content) => {
    if(err) console.log("ERROR: " + err.message);
    else {
        console.log("LECTURA ASINCRONA: ");
        console.log(content);

    }
})

console.log(__dirname);
console.log(__filename);