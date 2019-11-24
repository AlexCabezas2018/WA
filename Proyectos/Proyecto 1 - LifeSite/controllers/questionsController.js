"use strict";

const QuestionsModel = require('../models/questionsModel');
const questionModel = new QuestionsModel();


/**
 * Handles the / GET petition
 * @param {*} request 
 * @param {*} response 
 */
function handleIndex(request, response) {
    response.redirect('/questions/random-questions');
}

/**
 * Handles the Random Question view GET petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleRandomQuestions(request, response, next) {
    // TODO: comprobar si estás loggeado
    questionModel.getRandomQuestions((err, questions) => {
        if (err) next(err);
        else {
            response.render('random-questions', { questions /*, currentUser*/ });
        }
    });
}

/**
 * Handles the add question view GET petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleAddQuestion(request, response, next) {
    //TODO: Comrpobar que estás loggeado
    response.render('add-question');
}

/**
 * Handles the add question view POST petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleAddQuestionPost(request, response, next) {
    const question = request.body.question;
    const options = [request.body.option_1, request.body.option_2,
    request.body.option_3, request.body.option_4];
    questionModel.addQuestion(question, options, (err, correctInsert) => {
        if (err) next(err);
        else {
            if (!correctInsert) next(err);
            else response.redirect('random-questions');
        }
    });
}

/**
 * Handles the Answer question view GET petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleAnswerQuestion(request, response, next) {
    //TODO: Cargar ppregunta y modificar ejs para pintarla
    response.render('question-answer');
}

module.exports = {
    handleIndex,
    handleRandomQuestions,
    handleAddQuestion,
    handleAddQuestionPost,
    handleAnswerQuestion
}; 