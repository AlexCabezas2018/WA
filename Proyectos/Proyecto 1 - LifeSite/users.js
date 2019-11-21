"use strict";

const express = require('express');
const path = require('path');
const UsersDAO = require('./usersDAO');
const bodyParser = require('body-parser');
const session = require('express-session');

const usersRouter = express.Router();
const absolutePath = path.join(__dirname, 'public');
const usersDAO = new UsersDAO();

//TODO: Cuando inicio sesion y veo mi perfil, al desconectarme y voler a atrás, me sigue dejando.

usersRouter.use(bodyParser.urlencoded({ extended: false }));
usersRouter.use(express.static(path.join(__dirname, 'public')));
usersRouter.use(session({
    saveUninitialized: false,
    secret: 'foobar34',
    resave: false,
}));
/*usersRouter.use(checkIfLogged);

function checkIfLogged(request, response, next) {
    if (request.session.currentUser == undefined) response.redirect('login');
    else next();
}*/

usersRouter.get('/login', (request, response) => {
    if (request.session.currentUser == undefined) { //New user
        console.log('[INFO] New user entered!')
        response.status(200);
        response.render('logIn');
    }
    else {
        console.log('[INFO] User reconnection');
        response.status(200);
        response.redirect(`profile/${request.session.currentUser.id}`);
    }
});

usersRouter.post('/login', (request, response, next) => {
    usersDAO.checkCredentials(request.body.email,
        request.body.password,
        (err, usr) => {
            if (err) {
                next(err)
            }
            else {
                if (usr) {
                    request.session.currentUser = usr;
                    console.log(`[INFO] User with id ${usr.id} logged!`);
                    response.status(200).redirect(`profile/${usr.id}`);
                }
                else response.status(400).json({
                    status: 400,
                    reason: 'Usuario o contraseña no válidos'
                }); //TODO: Avisar de error y recargar la página.
            }
        })
});

usersRouter.get('/logout', (request, response) => {
    console.log(`[INFO]: User ${request.session.currentUser.id} disconnected!`);
    request.session.currentUser = undefined;
    response.status(200).redirect('login');
});

/* NEW USER*/
usersRouter.get('/new-user', (request, response) => {
    request.session.currentUser = undefined;
    response.status(200);
    response.render('new-user');
});

usersRouter.post('/new-user', (request, response, next) => {
    const usr = {
        email: request.body.email,
        pass: request.body.pass,
        name: request.body.name,
        gender: request.body.gender,
        birth_date: request.body.birth_date,
        profile_img: (request.body.profile_img == '') ? null : request.body.profile_img //TODO: No estamos insertando imágenes, tenemos que aprender a hacerlo
    }

    usersDAO.createUser(usr, (err, usrId) => {
        if (err) {
            next(err);
        }
        else response.redirect(`login`);
    });
})

/* PROFILE*/
usersRouter.get('/profile/:id', (request, response, next) => {
    if (request.session.currentUser == undefined) {
        response.status(403).redirect('../login');
    } else {
        usersDAO.getUserById(request.params.id,
            (err, usr) => {
                if (err) {
                    next(err);
                }
                else {
                    if (!usr) next(err);
                    else response.status(200).render('user-profile', { user: usr, sessionId: request.session.currentUser.id });
                }
            }
        );
    }
});

/* UPDATE PROFILE */
usersRouter.get('/update-profile', (request, response) => {
    response.status(200);
    if (request.session.currentUser == undefined) response.status(403).redirect('login');
    else response.status(200).render('update-profile', { currentId: request.session.currentUser.id });
});

usersRouter.post('/update-profile', (request, response, next) => {
    const { currentUser } = request.session;
    const usr = {
        pass: (request.body.pass == '') ? currentUser.pass : request.body.pass,
        name: (request.body.name == '') ? currentUser.username : request.body.name,
        gender: (request.body.gender == '') ? currentUser.gender : request.body.gender,
        birth_date: (request.body.birth_date == '') ? currentUser.birth_date.split('T')[0] : request.body.birth_date,
        profile_img: request.body.profile_img, //TODO: Poder mantener la foto de perfil si no quiere modificarla.
        email: currentUser.email
    }

    usersDAO.updateUser(usr, (err, correctUpdate) => {
        if (err) next(err);
        else {
            if (correctUpdate) response.redirect(`profile/${request.session.currentUser.id}`);
            else next(err);
        }
    })
})


/* FRIENDS PAGE */

usersRouter.get('/friends-page', (request, response , next) => {
    const { currentUser } = request.session;

    usersDAO.getFriendsByEmail(currentUser.email,
        (err, friends) => {
            if (err) next(err);
            else {
                usersDAO.getRequestsByEmail(currentUser.email,
                    (err, requests) => {
                        if (err) next(err);
                        else response.render('friends-page', { currentUser, requests, friends });
                    })
            }
        })
})

/* SEARCH FRIENDS*/

usersRouter.post('/search', (request, response, next) => {
    const { currentUser } = request.session;

    //get all users 
    usersDAO.getUsersByName(request.body.name, currentUser.email,
        (err, users) => {
            if (err) next(err);
            else { //get friends
                usersDAO.getFriendsByEmail(currentUser.email,
                    (err,friends)=>{
                        if(err) next(err);
                        else{ 
                            //get my requests
                            usersDAO.getMyRequestsByEmail(currentUser.email, (err,myRequests)=>{
                                if(err) next(err);
                                else{
                                    //get other requests
                                    usersDAO.getRequestsByEmail(currentUser.email, (err, usersRequests)=>{
                                        if(err) next(err);
                                        else{
                                            users.map(user => {
                                                //update users with friends 
                                                user.addRequest = true;
                                                friends.map(friend => {
                                                    if(friend.id == user.id) {
                                                        user.addRequest=false;
                                                    }
                                                })
                                                //update users with my requests
                                                myRequests.map(req => {
                                                    if(req.username_to == user.email) {
                                                        user.addRequest=false;
                                                    }
                                                })
                                                //update users with other requests
                                                usersRequests.map(req =>{
                                                    if(req.email == user.email) {
                                                        user.addRequest=false;
                                                    }
                                                })
                                            })
                                            response.render('search', { currentUser, users, name: request.body.name });
                                        }
                                    })
                                }
                            })
                        }
                    }
                )
            }
        }
    )

   
})


/* SEND REQUEST */

usersRouter.get('/add-request/:id', (request, response, next) => {
    const { currentUser } = request.session;

    //search user 
    usersDAO.getUserById(request.params.id, 
        (err,user) => {
            if(err) next(err);
        else { //add request
            usersDAO.addRequest(currentUser.email, user.email, 
                (err, correctInsert) => {
                    if(err) next(err);
                    
                    else {
                        if (correctInsert) response.redirect(`../profile/${user.id}`);
                        else next(err); 
                    }
                }
            )
        }
    })
})



/* ACCEPT AND REJECT REQUEST */

usersRouter.get('/accept-request/:id', (request, response, next) => {
    const { currentUser } = request.session;

    console.log()
    usersDAO.getUserById(request.params.id, (err, user) => {
        if(err) next(err);
        else{
            usersDAO.deleteRequest(currentUser.email, user.email, 
             (err, correctDelete) => {
                if(err) next(err);
                else{
                    if(!correctDelete) next(err);
                    else {
                        usersDAO.addFriend(currentUser.email, user.email, (err, correctInsert) => {
                            if(!correctInsert) next(err);
                            else response.redirect('../friends-page');
                        })
                    }
                }
            })
        }
    })
})

usersRouter.get('/reject-request/:id', (request, response, next) => {
    const { currentUser } = request.session;

    usersDAO.getUserById(request.params.id, (err, user) => {
        if(err) next(err);
        else{
            usersDAO.deleteRequest(currentUser.email, user.email, 
             (err, correctDelete) => {
                if(err) next(err);
                else{
                    if(correctDelete) response.redirect('../friends-page');
                    else next(err);
                }
            })
        }
    })
    
})


module.exports = usersRouter;

//TODO: Realizar el resto de rutas