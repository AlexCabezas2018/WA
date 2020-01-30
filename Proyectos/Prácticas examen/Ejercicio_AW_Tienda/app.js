"use strict";

const Express = require('express');
const userRouter = require('./routers/usersRouter');
const storeRouter = require('./routers/storeRouter');
const path = require('path');
const session = require('express-session');
const config = require('./config');
const expressValidator = require('express-validator');

const app = Express();

/* MIDDLEWARES */
app.use(Express.static(path.join(__dirname, 'public')));
app.use(session({
    saveUninitialized: false,
    secret: 'foobar34',
    resave: false,
}));
app.use(expressValidator());

/* ROUTERS */
app.use('/users', userRouter); // Applying usersRouter to the main route
app.use('/store', storeRouter); // Applying storeRouter to the main route

/* LOAD TEMPLATES */
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
    response.status(200).redirect('/users/login');
});

app.use((request, response, next) => { // 400: Not Found
    response.status(404).render("404", { url: request.url });
});

app.use(function (err, request, response, next) { //  500: Internal server error   
    response.status(500).render("500", {
        message: err.message,
    });
});

app.listen(config.port, (err) => console.log(err ? `[ERROR] ${err.message}` : `[INFO] Listening to port ${config.port}!`));