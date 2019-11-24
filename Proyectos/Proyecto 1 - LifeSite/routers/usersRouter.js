"use strict";

/* NPM REQUIRES */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

/* CONTROLLERS */
const usersController = require('../controllers/usersController');

const usersRouter = express.Router();

//TODO: Cuando inicio sesion y veo mi perfil, al desconectarme y voler a atrás, me sigue dejando.

usersRouter.use(bodyParser.urlencoded({ extended: false }));
usersRouter.use(express.static(path.join(__dirname, 'public')));
usersRouter.use(session({
    saveUninitialized: false,
    secret: 'foobar34',
    resave: false,
}));
usersRouter.use((request, response, next) => {
    response.setFlash = msg => {
        request.session.flashMsg = msg;
    }

    response.locals.getAndClearFlash = () => {
        let msg = request.session.flashMsg;
        delete request.session.flashMsg;
        return msg;
    };

    next();
})

/* LOGIN */
usersRouter.get('/login', usersController.handleLogin);
usersRouter.post('/login', usersController.handleLoginPost);

/* LOGOUT */
usersRouter.get('/logout', usersController.handleLogout);

/* NEW USER*/
usersRouter.get('/new-user', usersController.handleNewUser);
usersRouter.post('/new-user', usersController.handleNewUserPost);

/* PROFILE*/
usersRouter.get('/profile/:id', usersController.handleProfile);

/* UPDATE PROFILE */
usersRouter.get('/update-profile', usersController.handleUpdateProfile);
usersRouter.post('/update-profile', usersController.handleUpdateProfilePost);

/* FRIENDS PAGE */
usersRouter.get('/friends-page', usersController.handleFriendsPage);

/* SEARCH FRIENDS*/
usersRouter.post('/search', usersController.handleSearch);


/* SEND REQUEST */
usersRouter.get('/add-request/:id', usersController.handleAddRequest);

/* ACCEPT AND REJECT FRIEND REQUEST */
usersRouter.get('/accept-request/:id', usersController.handleAcceptRequest);
usersRouter.get('/reject-request/:id', usersController.handleRejectRequest);

module.exports = usersRouter;

//TODO: Realizar el resto de rutas