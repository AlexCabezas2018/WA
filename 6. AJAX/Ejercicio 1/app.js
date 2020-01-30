"use strict";

let records = [{ nombre: "Alejandro", puntos: 47 }, { nombre: "Rafael", puntos: 865 },
    { nombre: "Carmen", puntos: 563 },
    { nombre: "Rosario", puntos: 534 },
    { nombre: "Juan", puntos: 234 }
];

function ordenarLista() {
    records.sort((a, b) => b.puntos - a.puntos);
}

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));


app.get("/highestRecords", (req, res) => {
    ordenarLista();
    res.json(records.slice(0, 5));
});

app.post("/newRecord", (req, res) => {
    let nombre = req.body.name;
    let puntos = Math.floor(Math.random() * 1000) + 1;

    records.push({nombre, puntos});

    res.status(200).end();
})

app.listen(3000, (err) => console.log(err ? err.message : "Escuchando en el puerto 3000"));





