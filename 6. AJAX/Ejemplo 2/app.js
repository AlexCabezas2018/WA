"use strict";

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post("/factorial", function (request, response) {
    let numero = Number(request.body.num);
    if (!isNaN(numero) && numero >= 0) {
        // Cálculo del factorial
        let f = 1;
        for (let i = 2; i <= numero; i++) {
            f *= i;
        }
        // Devolución del resultado
        response.json({ result: f });
    } else {
        response.status(400);
        response.end();
    }
});


app.listen(3000, (err) => console.log(err ? err.message : "Escuchando en el puerto 3000!"));