"use strict";

const Express = require('express');
const userRouter = require('./routers/usersRouter');
const questionsRouter = require('./routers/questionsRouter');
const path = require('path');
const config = require('./config');

const app = Express();

/* MIDDLEWARES */
app.use(Express.static(path.join(__dirname, 'public')));

/* ROUTERS */
app.use('/users', userRouter); // Applying usersRouter to the main route
app.use('/questions', questionsRouter); // Applying questions to the main route


/* LOAD TEMPLATES */
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
    response.redirect('/users/login');
});

app.use((request, response, next) => { // 400: Not Found
    response.status(404);
    response.render("404", { url: request.url });
});

app.use(function (err, request, response, next) { //  500: Internal server error   
    response.status(500);
    response.render("500", {
        message: err.message,
    });
});

app.listen(config.port, (err) => console.log(err ? `[ERROR] ${err.message}` : `[INFO] Listening to port ${config.port}!`));