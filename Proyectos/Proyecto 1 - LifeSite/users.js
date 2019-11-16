const express = require('express');
const path = require('path');
const UsersDAO = require('./usersDAO');
const bodyParser = require('body-parser');

const usersRouter = express.Router();
const absolutePath = path.join(__dirname, 'public');
const usersDAO = new UsersDAO();
usersRouter.use(bodyParser.urlencoded({ extended: false }));

usersRouter.get('/login', (request, response) => {
    // TODO Comprobar si ya había una sesión abierta 
    response.status(200);
    response.sendFile(path.join(absolutePath, 'html', 'login.html'));
});

usersRouter.post('/login', (request, response) => {
    usersDAO.checkCredentials(request.body.email,
        request.body.password,
        (err, usrId) => {
            if (err) {
                response.status(400).json({
                    status: 400,
                    reason: err.message
                });
            }
            else {
                if (usrId) response.status(200).redirect(`/users/profile/${usrId}`);
                else response.status(400).end();
            }
        })

})

usersRouter.get('/new_user', (request, response) => {



});

usersRouter.get('/profile/:id', (request, response) => {
    // TODO LLamar al DAO, obtener el perfil dado el id del usuario. Cargar la plantilla con los parámetros necesarios.
    console.log('Hola usuario ' + request.params.id);
    response.end();
});

module.exports = usersRouter;

// TODO Realizar el resto de rutas