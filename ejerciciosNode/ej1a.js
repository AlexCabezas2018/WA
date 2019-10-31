"use strict"

const fs = require("fs")

fs.readFile("fichero.txt",{encoding: "utf-8"},
(err,content)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Archivo leido");
        fs.writeFile("fichero.txt",content.replace(/\s+/g, ' '),{encoding: "utf-8"},
        err => console.log((err) ? err.message : "Archivo escrito correctamente!"));
    }
})