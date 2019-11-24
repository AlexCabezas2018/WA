"use strict";

const express = require('express');
const path = require('path');
const QuestionsDAO = require('./questionsDAO');
const bodyParser = require('body-parser');
const session = require('express-session');

const questionsRouter = express.Router();
const absolutePath = path.join(__dirname, 'public');
const questionsDAO = new QuestionsDAO();

questionsRouter.use(bodyParser.urlencoded({ extended: false }));
questionsRouter.use(express.static(path.join(__dirname, 'public')));

//TODO: Mantener la sesion con el usuario (hay que acoplar usersRouter)
questionsRouter.get('/random-questions', (request, response, next ) => {
   // const { currentUser } = request.session;

    questionsDAO.getRandomQuestions((err, questions) => {
        if(err) next(err);
        else{
            response.render('random-questions', {questions /*, currentUser*/ });
        }
    })
})

questionsRouter.get('/add-question', (request, response, next) => {
    response.render('add-question');
})

questionsRouter.post('/add-question', (request, response, next) => {
    const question = request.body.question;
    const options = [request.body.option_1,request.body.option_2,
                     request.body.option_3,request.body.option_4];

    questionsDAO.addQuestion(question, options, (err, correctInsert) => {
        if(err) next(err);
        else {
            if(!correctInsert) next(err);
            else response.redirect('random-questions');
        }
    })
})

module.exports = questionsRouter; 