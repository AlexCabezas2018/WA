"use strict";

const Express = require('express');
const userRouter = require('./users');
const path = require('path');

const app = Express();

// TODO Middlewares
app.use('/users', userRouter); // Applying usersRouter to the main route
app.use(Express.static(path.join(__dirname, 'public')));

app.listen(3000, (err) => console.log(err ? `[ERROR] ${err.message}` : '[INFO] Listening to port 3000!'));

app.get('/', (request, response) => {
    response.redirect('/users/login');
});

//TODO: Página 404: realizar.