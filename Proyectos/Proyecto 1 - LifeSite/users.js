const express = require('express');
const path = require('path');
const UsersDAO = require('./usersDAO');
const bodyParser = require('body-parser');
const session = require('express-session');

const usersRouter = express.Router();
const absolutePath = path.join(__dirname, 'public');
const usersDAO = new UsersDAO();

usersRouter.use(bodyParser.urlencoded({ extended: false }));
usersRouter.use(session({
    saveUninitialized: false,
    secret: 'foobar34',
    resave: false,
}));

usersRouter.get('/login', (request, response) => {
    if (request.session.currentUserId == undefined) { //New user
        console.log('[INFO] New user entered!')
        response.status(200);
        response.sendFile(path.join(absolutePath, 'html', 'login.html'));
    }
    else {
        console.log('[INFO] User reconnection');
        response.status(200);
        response.redirect(`/users/profile/${request.session.currentUserId}`);
    }
});

usersRouter.post('/login', (request, response) => {
    usersDAO.checkCredentials(request.body.email,
        request.body.password,
        (err, usrId) => {
            if (err) {
                /*TODO: Internal Server Error: Página*/
                response.status(500).json({
                    status: 500,
                    reason: err.message
                });
            }
            else {
                if (usrId) {
                    request.session.currentUserId = usrId;
                    console.log(`[INFO] User with id ${usrId} logged!`);
                    response.status(200).redirect(`/users/profile/${usrId}`);
                }
                else response.status(400).json({
                    status: 400,
                    reason: 'Usuario o contraseña no válidos'
                }); //TODO: Avisar de error y recargar la página.
            }
        })
})

usersRouter.get('/new_user', (request, response) => {



});

usersRouter.get('/profile/:id', (request, response) => {
    // TODO LLamar al DAO, obtener el perfil dado el id del usuario. Cargar la plantilla con los parámetros necesarios.
    response.json({
        message: 'logged as user ' + request.params.id
    });
});

module.exports = usersRouter;

// TODO Realizar el resto de rutas