function checkLoginMiddleware(request, response, next) {
    if (request.session.currentUser == undefined) {
        response.redirect('/users/login');
    }
    else next();
}

function popUpMessages(request, response, next) {
    response.setFlash = msg => {
        request.session.flashMsg = msg;
    }

    response.locals.getAndClearFlash = () => {
        let msg = request.session.flashMsg;
        delete request.session.flashMsg;
        return msg;
    };

    next();
}

module.exports = {
    checkLoginMiddleware,
    popUpMessages
}