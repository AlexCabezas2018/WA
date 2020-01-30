"use strict";

let agenda = [{ nombre: "Juan", telefono: "89731982" },
{ nombre: "Carmen", telefono: "28329828" },
{ nombre: "David", telefono: "827272728" }];

const express = require('express');
const app = express();

app.use(express.json());

app.get("/contactos", (req, res) => {
    res.json(agenda);
});

app.get("/contactos/:indice", (req, res) => {
    if (isNaN(req.params.indice) || agenda[req.params.indice] === undefined) res.status(404).end();
    else res.status(200).json(agenda[req.params.indice]);
});

app.post("/contactos", (req, res) => {
    agenda.push(req.body);
    res.status(201).end();
});

app.delete("/contactos/:indice", function (request, response) {
    let indice = Number(request.params.indice);
    if (!isNaN(indice) && agenda[indice] !== undefined) {
        agenda.splice(indice, 1);
        // Código 200 = OK
        response.status(200);
    } else {
        // Error 404 = Not found
        response.status(404);
    }
    response.end();
});

app.put("/contactos/:indice", function (request, response) {
    let indice = Number(request.params.indice);
    if (!isNaN(indice) && agenda[indice] !== undefined) {
        agenda[indice] = request.body;
    } else {
        // Error 404 = Not Found
        response.status(404);
    }
    response.end();
});


app.listen(3000, (err) => console.log(err ? err.message : "Escuchando en el puerto 3000!"));