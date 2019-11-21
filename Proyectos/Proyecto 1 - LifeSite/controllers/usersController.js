const usersModel = require('../models/usersModel');

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
    usersModel.checkCredentials(request.body.email,
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
        }
    );
}

/**
 * Handles the logout GET petition
 * @param {*} request 
 * @param {*} response 
 */
function handleLogout(request, response) {
    request.session.currentUser = undefined;
    response.status(200);
    response.render('new-user');
}

function handleNewUser(request, response) {
    
}

module.exports = {
    handleLogin,
    handleLoginPost,
    handleLogout
}