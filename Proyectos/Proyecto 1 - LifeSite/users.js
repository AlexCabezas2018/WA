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
        response.render('logIn');
    }
    else {
        console.log('[INFO] User reconnection');
        response.status(200);
        response.redirect(`/users/profile/${request.session.currentUserId}`);
    }
});

usersRouter.post('/logIn', (request, response) => {
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
                    response.status(200).redirect(`profile/${usrId}`);
                }
                else response.status(400).json({
                    status: 400,
                    reason: 'Usuario o contraseña no válidos'
                }); //TODO: Avisar de error y recargar la página.
            }
        })
})

/* NEW USER*/
usersRouter.get('/new-user', (request, response) => {
    response.status(200);
    response.render('new-user');
});

usersRouter.post('/new-user', (request, response) => {
    usr = {
        email: request.body.email,
        pass: request.body.pass,
        name: request.body.name,
        gender: request.body.gender,
        birth_date: request.body.birth_date,
        profile_img: (request.body.profile_img == undefined) ? "" : request.body.profile_img
    }

    //TODO CONSULTA NO DEVUELVE NADA
    usersDAO.createUser(usr, (err, usrId) => {
        if (err) {
            response.status(400).json({
                status: 400,
                reason: err.message
            });
        }
        else response.redirect(`profile/${usrId}`);
    })
})

/* PROFILE*/
usersRouter.get('/profile/:id', (request, response) => {
    // TODO Ver porque no carga el css
    usersDAO.getUserById(request.params.id,
        (err, usr) => {
            if (err) {
                response.status(400).json({
                    status: 400,
                    reason: err.message
                });
            }
            else {
                if (usr == null) response.status(400);
                else response.render('user-profile', { user: usr });
            }
            response.end();
        });
});

/* UPDATE PROFILE */
// TO DO Ver por que no carga update profile, cosa fea en user-profile.ejs en modificar perfil
usersRouter.get('/update-profile', (request, response) => {
    response.status(200);
    response.render('update-profile');
});

usersRouter.post('/update-profile', (request, response) => {
    usr = {
        pass: request.body.pass,
        name: request.body.name,
        gender: request.body.gender,
        birth_date: request.body.birth_date,
        profile_img: (request.body.profile_img == undefined) ? "" : request.body.profile_img
    }

    usersDAO.updateUser(usr, (err, usrId) => {
        if (err) {
            response.status(400).json({
                status: 400,
                reason: err.message
            });
        }
        else response.redirect(`profile/${usrId}`);
    })
})

module.exports = usersRouter;

// TODO Realizar el resto de rutas