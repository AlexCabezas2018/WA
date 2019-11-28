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
    request.session.currentUser = undefined;
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
    response.render('new-user');
}

/**
 * Handles the new user POST petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleNewUserPost(request, response, next) {
    const usr = {
        email: request.body.email,
        pass: request.body.pass,
        name: request.body.name,
        gender: request.body.gender,
        birth_date: request.body.birth_date,
        profile_img: request.file ? request.file.buffer : null,
    }

    usersDAOModel.createUser(usr, (err, usrId) => {
        if (err) {
            next(err);
        }
        else response.redirect(`login`);
    });
}

/**
 * Handles the profile GET petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleProfile(request, response, next) {
    usersDAOModel.getUserById(request.params.id,
        (err, usr) => {
            if (err) {
                next(err);
            }
            else {
                if (!usr) next(err);
                else response
                    .status(200)
                    .render('user-profile',
                        { user: usr, sessionId: request.session.currentUser.id });
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
                if (!img) response.status(200).sendFile(path.join(__dirname, "..", "public", "img", "contact-img.png")); //TODO: Añadir imagen por defecto
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
    response.status(200).render('update-profile', { currentId: request.session.currentUser.id });
}

/**
 * Handles the update profile new POST petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleUpdateProfilePost(request, response, next) {
    const { currentUser } = request.session;
    const usr = {
        pass: (request.body.pass == '') ? currentUser.pass : request.body.pass,
        name: (request.body.name == '') ? currentUser.username : request.body.name,
        gender: (request.body.gender == '') ? currentUser.gender : request.body.gender,
        birth_date: (request.body.birth_date == '') ? currentUser.birth_date.split('T')[0] : request.body.birth_date,
        profile_img: request.file ? request.file.buffer : Buffer.from(currentUser.profile_img.data, "binary"),
        email: currentUser.email
    }

    usersDAOModel.updateUser(usr, (err, correctUpdate) => {
        if (err) next(err);
        else {
            if (correctUpdate) response.redirect(`profile/${request.session.currentUser.id}`);
            else next(err);
        }
    });
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
                                console.log(err.message);
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
    handleRejectRequest
}