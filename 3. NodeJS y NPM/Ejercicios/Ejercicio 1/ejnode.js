"use strict"

const fs = require("fs")


function freplace(fichero,buscar,sustituir,callback){


    fs.readFile(fichero,{encoding: "utf-8"},
    (err,content)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Archivo leido");
            fs.writeFile(fichero,content.replace(buscar, sustituir),{encoding: "utf-8"},
            err => {
                if (err) callback(new Error(err.message));
                else callback(null);
            })
        }
    })

}

module.exports = freplace;