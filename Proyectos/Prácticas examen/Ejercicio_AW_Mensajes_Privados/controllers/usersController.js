const usersModel = require('../models/usersModel');
const path = require('path');
const usersDAOModel = new usersModel();

/**
 * Handles the login GET petition
 * @param {*} request 
 * @param {*} response 
 */
function handleLogin(request, response) {
    if (request.session.currentUser == undefined) {
        console.log('[INFO] New user entered!')
        response.status(200);
        response.render('logIn');
    }
    else {
        console.log('[INFO] User reconnection');
        response.status(200);
        response.redirect(`profile/${request.session.currentUser.id}`);
    }
}

/**
 * Handles the login POST petition. Redirects to the profile using the given credentials
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleLoginPost(request, response, next) {
    usersDAOModel.checkCredentials(request.body.email,
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
                else {
                    response.setFlash('Usuario o contraseña inválidos');
                    response.redirect('login');
                }
            }
        }
    );
}

/**
 * Handles the logout GET petition
 * @param {*} request 
 * @param {*} response 
 */
function handleLogout(request, response) {
    console.log(`[INFO]: User ${request.session.currentUser.id} disconnected!`);
    request.session.destroy();
    response.status(200).redirect('login');
}

/**
 * Handles the new user GET petition
 * @param {*} request 
 * @param {*} response 
 */
function handleNewUser(request, response) {
    request.session.currentUser = undefined;
    response.status(200);
    response.render('new-user', { errors: [] });
}

/**
 * Handles the new user POST petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleNewUserPost(request, response, next) {
    request.checkBody('email', "Dirección de correo no válida").isEmail();
    request.checkBody('pass', "La contraseña debe tener más de 5 caracteres").isLength({ min: 5 });
    request.checkBody('birth_date', "Fecha no válida").isBefore();

    request.getValidationResult().then(result => {
        if (result.isEmpty()) {
            const usr = {
                email: request.body.email,
                pass: request.body.pass,
                name: request.body.name,
                gender: request.body.gender,
                birth_date: request.body.birth_date,
                profile_img: request.file ? request.file.mimetype.startsWith('image') ? request.file.buffer : null : null,
            }

            usersDAOModel.createUser(usr, (err, usrId) => {
                if (err) {
                    next(err);
                }
                else response.status(200).redirect(`login`);
            });
        }
        else {
            response.status(400).render('new-user', { errors: result.array() })
        }
    })

}

/**
 * Handles the profile GET petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleProfile(request, response, next) {
    const { currentUser } = request.session;
    let id = Number(request.params.id);

    if (isNaN(id)) {
        next();
        return;
    }

    usersDAOModel.getUserById(id,
        (err, usr) => {
            if (err) {
                next(err);
            }
            else {
                if (!usr) next(err);
                else {
                    response.status(200).render('user-profile', { user: usr, currentUser, currentAge: new Date().getFullYear() - usr.birth_date.getFullYear() });
                }
            }
        }
    );
}

/**
 * Handles the profile picture GET petition to get the users profile images.
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleProfilePicture(request, response, next) {
    usersDAOModel.getUserProfilePicture(request.params.id,
        (err, img) => {
            if (err) next(err);
            else {
                if (!img) response.status(200).sendFile(path.join(__dirname, "..", "public", "img", "contact-img.png"));
                else response.end(img);
            }
        })
}

/**
 * Handles the update profile view GET petition
 * @param {*} request 
 * @param {*} response 
 */
function handleUpdateProfile(request, response) {
    response.status(200).render('update-profile', { currentId: request.session.currentUser.id, errors: [] });
}

/**
 * Handles the update profile new POST petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleUpdateProfilePost(request, response, next) {
    const { currentUser } = request.session;
    let profileImg = () => {
        if (request.file) return request.file.mimetype.startsWith('image') ? request.file.buffer : null;
        return currentUser.profile_img ? Buffer.from(currentUser.profile_img.data, "binary") : null;
    }

    const usr = {
        pass: (request.body.pass == '') ? currentUser.pass : request.body.pass,
        name: (request.body.name == '') ? currentUser.username : request.body.name,
        gender: (request.body.gender == '') ? currentUser.gender : request.body.gender,
        birth_date: (request.body.birth_date == '') ? currentUser.birth_date.split('T')[0] : request.body.birth_date,
        profile_img: profileImg(),
        email: currentUser.email
    }

    let errors = [];
    if (usr.pass.length < 5) errors.push('La nueva contraseña debe contener más de 5 caracteres');
    if (new Date(usr.birth_date) > new Date()) errors.push('Fecha inválida')

    if (errors.length == 0) {
        usersDAOModel.updateUser(usr, (err, correctUpdate) => {
            if (err) next(err);
            else {
                if (correctUpdate) response.redirect(`profile/${request.session.currentUser.id}`);
                else next(err);
            }
        });
    }
    else {
        response.status(200).render('update-profile', { currentId: request.session.currentUser.id, errors });
    }
}

/**
 * Handles the friends page view GET petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleFriendsPage(request, response, next) {
    const { currentUser } = request.session;

    usersDAOModel.getFriendsByEmail(currentUser.email,
        (err, friends) => {
            if (err) next(err);
            else {
                usersDAOModel.getRequestsByEmail(currentUser.email,
                    (err, requests) => {
                        if (err) next(err);
                        else response.render('friends-page', { currentUser, requests, friends });
                    });
            }
        });
}

/**
 * Handles the search view POST petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleSearch(request, response, next) {
    const { currentUser } = request.session;
    //get all users 
    usersDAOModel.getUsersByName(request.body.name, currentUser.email,
        (err, users) => {
            if (err) next(err);
            else { //get friends
                usersDAOModel.getFriendsByEmail(currentUser.email,
                    (err, friends) => {
                        if (err) next(err);
                        else {
                            //get my requests
                            usersDAOModel.getMyRequestsByEmail(currentUser.email,
                                (err, myRequests) => {
                                    if (err) next(err);
                                    else {
                                        //get other requests
                                        usersDAOModel.getRequestsByEmail(currentUser.email,
                                            (err, usersRequests) => {
                                                if (err) next(err);
                                                else {
                                                    users.map(user => {
                                                        //update users with friends 
                                                        user.addRequest = true;
                                                        friends.map(friend => { if (friend.id == user.id) user.addRequest = false; })
                                                        //update users with my requests
                                                        myRequests.map(req => { if (req.username_to == user.email) user.addRequest = false; })
                                                        //update users with other requests
                                                        usersRequests.map(req => { if (req.email == user.email) user.addRequest = false; })
                                                    });
                                                    response.render('search', { currentUser, users, name: request.body.name });
                                                }
                                            });
                                    }
                                });
                        }
                    });
            }
        });
}

/**
 * Handles the Add request GET petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleAddRequest(request, response, next) {
    const { currentUser } = request.session;
    //search user 
    usersDAOModel.getUserById(request.params.id,
        (err, user) => {
            if (err) next(err);
            else { //add request
                usersDAOModel.addRequest(currentUser.email, user.email,
                    (err, correctInsert) => {
                        if (err) next(err);
                        else {
                            if (correctInsert) response.redirect('../friends-page');
                            else {
                                next(err);
                            }
                        }
                    });
            }
        });
}

/**
 * Handles the Accept request GET petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleAcceptRequest(request, response, next) {
    const { currentUser } = request.session;

    usersDAOModel.getUserById(request.params.id, (err, user) => {
        if (err) next(err);
        else {
            usersDAOModel.deleteRequest(currentUser.email, user.email,
                (err, correctDelete) => {
                    if (err) next(err);
                    else {
                        if (!correctDelete) next(err);
                        else {
                            usersDAOModel.addFriend(currentUser.email, user.email, (err, correctInsert) => {
                                if (!correctInsert) next(err);
                                else response.redirect('../friends-page');
                            });
                        }
                    }
                });
        }
    });
}

/**
 * Handles the Reject request GET petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleRejectRequest(request, response, next) {
    const { currentUser } = request.session;

    usersDAOModel.getUserById(request.params.id, (err, user) => {
        if (err) next(err);
        else {
            usersDAOModel.deleteRequest(currentUser.email, user.email,
                (err, correctDelete) => {
                    if (err) next(err);
                    else {
                        if (correctDelete) response.redirect('../friends-page');
                        else next(err);
                    }
                })
        }
    })
}

function handleConversations(request, response, next) {
    const { currentUser } = request.session;
    usersDAOModel.getFriendsByEmail(currentUser.email, (err, friends) => {
        if(err) next(err);
        else {
            // Comprobamos si esa persona es amiga tuya, para evitar chatear con personas no amigas.
            const friendFiltered = friends.filter(friend => friend.id == request.params.idWith);
            if(friendFiltered.length === 0) response.status(403).redirect('back');
            else {
                const friend = friendFiltered[0];
                //Obtenemos su conversación.
                usersDAOModel.getConversation(currentUser.id, friend.id, (err, msgs) => {
                    if(err) next(err);
                    else {
                        /*Le añadimos un atributo flag que nos diga si el mensaje es enviado por nosotros o no. Otra opción sería que el cliente lo hiciese en la plantilla,
                        pero creo que eso añadiría lógica innecesaria a las plantillas.*/
                        const mappedMessages = msgs.map(msg => { return { ...msg, sent: msg.user_from == currentUser.id }});
                        response.status(200).render('conversations', { currentUser, friend, msgs: mappedMessages });
                    }
                });
            }
        }
    })
}

function handleConversationsPost(request, response, next) {
    const { currentUser } = request.session;
    const messageToInsert = {
        user_from: currentUser.id,
        user_to: request.params.idWith,
        msg: request.body.message_content,
    };
    // Comprobamos si el mensaje está vacío.
    if(!messageToInsert || messageToInsert.msg === '') response.status(400).redirect('back');
    else {
        // NOTA: Aunque el método se llame 'updateConversation' realmente no actualiza nada, simplemente inserta el mensaje.
        usersDAOModel.updateConversation(messageToInsert, (err, success) => {
            if (err) next(err);
            else response.status(200).redirect('back');
        });
    }
}

module.exports = {
    handleLogin,
    handleLoginPost,
    handleLogout,
    handleProfilePicture,
    handleNewUser,
    handleNewUserPost,
    handleProfile,
    handleUpdateProfile,
    handleUpdateProfilePost,
    handleFriendsPage,
    handleSearch,
    handleAddRequest,
    handleAcceptRequest,
    handleRejectRequest,
    handleConversations,
    handleConversationsPost
}