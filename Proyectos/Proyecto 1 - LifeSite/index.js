"use strict";

const Express = require('express');
const userRouter = require('./routers/usersRouter');
const path = require('path');

const app = Express();

// TODO Middlewares
app.use('/users', userRouter); // Applying usersRouter to the main route
app.use('/questions', questionsRouter); // Applying usersRouter to the main route
app.use(Express.static(path.join(__dirname, 'public')));

//Load templates
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.listen(3000, (err) => console.log(err ? `[ERROR] ${err.message}` : '[INFO] Listening to port 3000!'));

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