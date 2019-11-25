"use strict";

/* NPM REQUIRES */
const express = require('express');
const path = require('path');
const middlewares = require('../middlewares');

/* CONTROLLERS */
const usersController = require('../controllers/usersController');

const usersRouter = express.Router();

//TODO: Cuando inicio sesion y veo mi perfil, al desconectarme y voler a atrás, me sigue dejando.

usersRouter.use(express.urlencoded({ extended: false }));
usersRouter.use(express.static(path.join(__dirname, 'public')));

usersRouter.use(middlewares.popUpMessages);

/* LOGIN */
usersRouter.get('/login', usersController.handleLogin);
usersRouter.post('/login', usersController.handleLoginPost);

/* LOGOUT */
usersRouter.get('/logout', middlewares.checkLoginMiddleware, usersController.handleLogout);

/* NEW USER*/
usersRouter.get('/new-user', usersController.handleNewUser);
usersRouter.post('/new-user', usersController.handleNewUserPost);

/* PROFILE*/
usersRouter.get('/profile/:id', middlewares.checkLoginMiddleware, usersController.handleProfile);

/* UPDATE PROFILE */
usersRouter.get('/update-profile', middlewares.checkLoginMiddleware, usersController.handleUpdateProfile);
usersRouter.post('/update-profile', middlewares.checkLoginMiddleware, usersController.handleUpdateProfilePost);

/* FRIENDS PAGE */
usersRouter.get('/friends-page', middlewares.checkLoginMiddleware, usersController.handleFriendsPage);

/* SEARCH FRIENDS*/
usersRouter.post('/search', middlewares.checkLoginMiddleware, usersController.handleSearch);


/* SEND REQUEST */
usersRouter.get('/add-request/:id', middlewares.checkLoginMiddleware, usersController.handleAddRequest);

/* ACCEPT AND REJECT FRIEND REQUEST */
usersRouter.get('/accept-request/:id', middlewares.checkLoginMiddleware, usersController.handleAcceptRequest);
usersRouter.get('/reject-request/:id', middlewares.checkLoginMiddleware, usersController.handleRejectRequest);

module.exports = usersRouter;

//TODO: Realizar el resto de rutas