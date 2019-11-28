// Practica 4
// Alejandro Cabezas Garríguez
// Manuel Monforte Escobar

"use strict";

const config = require("./config");
const DAOTasks = require("./DAOTasks");
const DAOUsers = require('./DAOUsers');
const utils = require('./utils');
const path = require("path");
const mysql = require("mysql");
const session = require('express-session');
const mysqlSession = require('express-mysql-session');
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.mysqlConfig);
const express = require("express");

const middleware = session({
    saveUninitialized: false,
    secret: 'foobar34',
    resave: false,
    store: sessionStore
});

// Crear un servidor Express.js
const app = express();
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(middleware);

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOTasks
const daoTasks = new DAOTasks(pool);
const daoUsers = new DAOUsers(pool);

/* Middleware de acceso */
function currentUser(request, response, next) {
    if(request.session.currentUser) {
        response.locals.userEmail = request.session.currentUser;
        next();
    }
    else {
        response.status(403).redirect('/login');
    }
}


app.get("/tasks", currentUser, (request, response) => {
    daoTasks.getAllTasks(response.locals.userEmail, (err, list) => {
        if (err) {
            console.log(err.message);
            response.status(500).end();
        }
        else response.status(200).render('tasks', { taskList: list, user: response.locals.userEmail });
    })
});

app.post("/addTask", (request, response) => {
    const { text, tags } = utils.createTask(request.body.taskText);
    const task = { text, tags, user: request.session.currentUser, done: 0 }

    daoTasks.insertTask(request.session.currentUser, task, err => {
        if (err) {
            console.log(err.message);
            response.status(500).end();
        }
        else {
            response.status(200).redirect("tasks");
        }
    });
});

app.get("/finish/:id", currentUser, (request, response) => {
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

app.get("/deletedCompleted", currentUser, (request, response) => {
    daoTasks.deletedCompleted(request.session.currentUser, (err) => {
        if (err) {
            console.log(err.message);
            response.status(500).end();
        }
        else {
            response.status(200).redirect("tasks");
        }
    })
});

/* Practica 5 */

app.get('/login', (request, response) => {
    response.status(200).render('login', {errorMsg: null})
});

app.post('/login', (request, response) => {
    daoUsers.isUserCorrect(request.body.email, request.body.password, 
        (err, isCorrectUser) => {
            if(err) response.status(500).render('login', {errorMsg: err.message})
            else {
                if(isCorrectUser) {
                    request.session.currentUser = request.body.email;
                    response.status(200).redirect('tasks');
                }
                else response.status(400).render('login', {errorMsg: 'Usuario o contraseña inválidos'});
            }
        })
})


app.get('/logout', currentUser, (request, response) => {
    request.session.destroy();
    response.redirect('login');
})

app.get('/imagenUsuario', (request, response) => {
    daoUsers.getUserImageName(request.session.currentUser, (
        err, userPath) => {
            if(err) response.status(500).end();
            else {
                if(!userPath) response.status(200).sendFile(path.join(__dirname, 'public', 'img', 'NoPerfil.png'));
                else response.status(200).sendFile(path.join(__dirname, 'profile_imgs', userPath));
            }
        });
})

app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});

