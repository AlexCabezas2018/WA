// Practica 4
// Alejandro Cabezas Garríguez
// Manuel Monforte Escobar

"use strict";

const correo = "usuario@ucm.es";

const config = require("./config");
const DAOTasks = require("./DAOTasks");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");

// Crear un servidor Express.js
const app = express();
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));


// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOTasks
const daoTasks = new DAOTasks(pool);

app.get("/tasks", (request, response) => {
    daoTasks.getAllTasks(correo, (err, list) => {
        if (err) {
            console.log(err.message);
            response.status(500).end();
        }
        else response.status(200).render('tasks', { taskList: list });
    })
});

app.post("/addTask", (request, response) => {
    const { text, tags } = utils.createTask(request.body.taskText);
    const task = { text, tags, user: correo, done: 0 }

    daoTasks.insertTask(correo, task, err => {
        if (err) {
            console.log(err.message);
            response.status(500).end();
        }
        else {
            response.status(200).redirect("tasks");
        }
    });
});

app.get("/finish/:id", (request, response) => {
    daoTasks.markTaskDone(request.params.id, (err) => {
        if (err) {
            console.log(err.message);
            response.status(500).end();
        }
        else {
            response.status(200).redirect("../tasks");
        }
    })
});

app.get("/deletedCompleted", (request, response) => {
    daoTasks.deletedCompleted(correo, (err) => {
        if (err) {
            console.log(err.message);
            response.status(500).end();
        }
        else {
            response.status(200).redirect("tasks");
        }
    })
});

// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});

