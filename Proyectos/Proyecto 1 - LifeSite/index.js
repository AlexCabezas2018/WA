"use strict";

const Express = require('express');
const userRouter = require('./users');
const path = require('path');

const app = Express();


// TODO Middlewares
app.use('/users', userRouter); // Applying usersRouter to the main route
app.use(Express.static(path.join(__dirname, 'public')));

//Load templates
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.listen(3000, (err) => console.log(err ? `[ERROR] ${err.message}` : '[INFO] Listening to port 3000!'));

app.get('/', (request, response) => {
    response.redirect('/users/login');
});

// TODO: Cargar imagen de fondo en el css ¿Rutas?
app.use((request, response, next) =>{
    response.status(404);
    response.render("404", { url: request.url });
});   