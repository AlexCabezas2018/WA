"use strict";

/* NPM REQUIRES */
const express = require('express');
const path = require('path');
const questionsController = require('../controllers/questionsController');
const middlewares = require('../middlewares');

const questionsRouter = express.Router();

questionsRouter.use(express.urlencoded({ extended: false }));
questionsRouter.use(express.static(path.join(__dirname, 'public')));

/* INDEX */
questionsRouter.get('/', middlewares.checkLoginMiddleware, questionsController.handleIndex);

/* RANDOM QUESTIONS */
questionsRouter.get('/random-questions', middlewares.checkLoginMiddleware, questionsController.handleRandomQuestions);

/* ADD QUESTION*/
questionsRouter.get('/add-question', middlewares.checkLoginMiddleware, questionsController.handleAddQuestion);
questionsRouter.post('/add-question', middlewares.checkLoginMiddleware, questionsController.handleAddQuestionPost);

/* SHOW QUESTION */
questionsRouter.get('/show-question/:id', middlewares.checkLoginMiddleware, questionsController.handleShowQuestion);

/* ANSWER QUESTION */
questionsRouter.get('/answer-question/:id', middlewares.checkLoginMiddleware, questionsController.handleAnswerQuestion);
questionsRouter.post('/answer-question', middlewares.checkLoginMiddleware, questionsController.handleAnswerQuestionPost);

/* ANSWER LIKE FRIEND */
questionsRouter.get('/answer-like-friend', middlewares.checkLoginMiddleware, questionsController.handleAnswerLikeFriend);

module.exports = questionsRouter;