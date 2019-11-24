"use strict";

/* NPM REQUIRES */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session'); //TODO: Usarlo.
const questionsController = require('../controllers/questionsController');

const questionsRouter = express.Router();

questionsRouter.use(bodyParser.urlencoded({ extended: false }));
questionsRouter.use(express.static(path.join(__dirname, 'public')));

/* INDEX */
questionsRouter.get('/', questionsController.handleIndex);

/* RANDOM QUESTIONS */
questionsRouter.get('/random-questions', questionsController.handleRandomQuestions);

/* ADD QUESTION*/
questionsRouter.get('/add-question', questionsController.handleAddQuestion);
questionsRouter.post('/add-question', questionsController.handleAddQuestionPost);

/* SHOW QUESTION */
questionsRouter.get('/show-question/:id', questionsController.handleShowQuestion);

/* ANSWER QUESTION */
questionsRouter.get('/answer-question/:id', questionsController.handleAnswerQuestion);
questionsRouter.post('/answer-question/', questionsController.handleAnswerQuestionPost);

module.exports = questionsRouter;