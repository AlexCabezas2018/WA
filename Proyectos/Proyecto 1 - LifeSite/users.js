const express = require('express');
const path = require('path');
const UsersDAO = require('./usersDAO');
const bodyParser = require('body-parser');

const usersRouter = express.Router();
const absolutePath = path.join(__dirname, 'public');
const usersDAO = new UsersDAO();

usersRouter.use(bodyParser.urlencoded({ extended: false }));
usersRouter.use(express.static(path.join(__dirname, 'public')));

/* LOG IN */

usersRouter.get('/logIn', (request, response) => {
    // TODO Comprobar si ya había una sesión abierta 
    response.status(200);
    response.render('logIn');
});

usersRouter.post('/logIn', (request, response) => {
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
                if (usrId!=null) response.status(200).redirect(`profile/${usrId}`);
                else response.status(400).end();
            }
        })
})

/* NEW USER*/
usersRouter.get('/new-user', (request, response) => {
    response.status(200);
    response.render('new-user');
});

usersRouter.post('/new-user',(request,response)=>{
    usr={
        email: request.body.email,
        pass: request.body.pass,
        name: request.body.name,
        gender: request.body.gender,
        birth_date: request.body.birth_date,
        profile_img: (request.body.profile_img == undefined )  ? "":request.body.profile_img
    }
    
    //TODO CONSULTA NO DEVUELVE NADA
    usersDAO.createUser(usr,(err,usrId)=>{
        if(err){
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
        (err,usr)=>{
            if(err){
                response.status(400).json({
                    status: 400,
                    reason: err.message
                });
            }
            else {
                if(usr==null) response.status(400) ;
                else response.render('user-profile',{user:usr});
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

usersRouter.post('/update-profile',(request,response)=>{
    usr={
        pass: request.body.pass,
        name: request.body.name,
        gender: request.body.gender,
        birth_date: request.body.birth_date,
        profile_img: (request.body.profile_img == undefined )  ? "":request.body.profile_img
    }
    
    usersDAO.updateUser(usr,(err,usrId)=>{
        if(err){
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