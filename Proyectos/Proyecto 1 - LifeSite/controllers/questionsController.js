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
    const currentUser = request.session.currentUser;

    questionModel.getRandomQuestions((err, questions) => {
        if (err) next(err);
        else {
            response.render('random-questions', { questions, currentUser });
        }
    });
}

/**
 * Handles the add question view GET petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleAddQuestion(request, response) {
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
 * Handles the Show question view GET petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleShowQuestion(request, response, next) {
    const currentUser = request.session.currentUser;

    //busco la pregunta
    questionModel.getQuestionById(request.params.id,
        (err, question) => {
            if (err) next(err);
            else { // una vez encontrada la pregunta, busco si la he contestado
                questionModel.checkQuestionIsAnswer(currentUser.email, question.id,
                    (err, answers) => { // actualizado si la he contestado
                        const reply = (answers.length == 0) ? false : true;

                        //busco a mis amigos que la han respondido
                        questionModel.getFriendsAnswersByQuestion(currentUser.email, question.id,
                            (err, friends) => {
                                if (err) next(err);
                                else {
                                    //TODO: El div debe mostrar nombre no correo

                                    //por cada amigo busco en la tabla respuestas por amigo si existe una con user = ? friend = ? id_question= ? 
                                    //actualizamos si adivinamos o no
                                    friends.forEach(friend => {
                                        questionModel.getAnswerLikeFriend(currentUser.email, friend.username_2, question.id,
                                            (err, id_answerLikeFriend) => {
                                                if (err) next(err);
                                                else {
                                                    if (id_answerLikeFriend.length == 0) friend.guess = true;
                                                    else {
                                                        friend.guess = false;
                                                        friend.myAnswer = id_answerLikeFriend[0];
                                                    }
                                                }
                                            }
                                        )
                                    })

                                    console.log(friends);

                                    //actualizamos si es correcta o no
                                    friends.forEach(friend => {
                                        if (!friend.guess) {
                                            questionModel.checkQuestionIsAnswer(friend.username_2, question.id,
                                                (err, id_friendAnswer) => {
                                                    if (err) next(err);
                                                    else {
                                                        if(!friend.guess) friend.correct = (friend.myAnswer == id_friendAnswer) ? true : false;
                                                    }
                                                })
                                        }
                                    })
                        
                                    console.log(friends);
                                    //comprobar si he contestado ya como el poner adivinar acertado, fallaste
                                    request.session.question = question;
                                    response.render('question-show',
                                        { question, currentUser, reply, users: friends });
                                }
                            }
                        )
                    }
                )
            }
        }
    )
}

/**
 * Handles the answer question GET PETITION
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleAnswerQuestion(request, response, next) {
    const question = request.session.question;
    const currentUser = request.session.currentUser;

    questionModel.getAnswerByQuestion(request.params.id,
        (err, answers) => {
            if (err) next(err);
            else response.render('question-view', { answers, question, currentUser });
        })
}

/**
 * Handles the answer question POST PETITION
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleAnswerQuestionPost(request, response, next) {

    const currentUser = request.session.currentUser;
    const option = (request.body.option == "new") ? "new" : request.body.option;
    const question = request.session.question;

    if (option == "new") {
        questionModel.addAnswer(question.id, request.body.answer_body,
            (err, id_answer) => {
                if (err) next(err);
                else {
                    questionModel.addUserAnswer(currentUser.email, id_answer,
                        (err, correctInsert) => {
                            if (err) next(err);
                            else {
                                if (!correctInsert) next(err);
                                else response.redirect(`../show-question/${question.id}`);
                            }
                        })
                }
            })
    }
    else {
        questionModel.addUserAnswer(currentUser.email, option,
            (err, correctInsert) => {
                if (err) next(err);
                else {
                    if (!correctInsert) next(err);
                    else response.redirect(`../show-question/${question.id}`);
                }
            })
    }
}

/**
 * Handles the answer like friend GET PETITION
 */
function handleAnswerLikeFriend(request, response, next) {
    //TODO Implemenentar Adivinar respuesta de amigo
}
module.exports = {
    handleIndex,
    handleRandomQuestions,
    handleAddQuestion,
    handleAddQuestionPost,
    handleShowQuestion,
    handleAnswerQuestion,
    handleAnswerQuestionPost,
    handleAnswerLikeFriend
}; 