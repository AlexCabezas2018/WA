"use strict";

const QuestionsModel = require('../models/questionsModel');
const UserModel = require('../models/usersModel');
const questionDAOModel = new QuestionsModel();
const userModel = new UserModel();

//TODO: Al responder por un amigo sacar siempre respuesta correcta

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

    questionDAOModel.getRandomQuestions((err, questions) => {
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
    const currentUser = request.session.currentUser;
    response.render('add-question', { currentUser });
}

/**
 * Handles the add question view POST petition
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleAddQuestionPost(request, response, next) {
    const question = request.body.question;
    let options = [request.body.option_1, request.body.option_2,
    request.body.option_3, request.body.option_4];

    //get the options
    options = options.filter(option => option != "");
    questionDAOModel.addQuestion(question, options, (err, correctInsert) => {
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
    request.session.friend == undefined;

    let id = Number(request.params.id);

    if(isNaN(id)) {
        next();
        return;
    }

    //busco la pregunta
    questionDAOModel.getQuestionById(id,
        (err, question) => {
            if (err) next(err);
            else {
                questionDAOModel.checkQuestionIsAnswer(currentUser.email, question.id,
                    (err, answers) => { // actualizado si la he contestado
                        const reply = (answers.length == 0) ? false : true;

                        //get friend who has answered the question
                        questionDAOModel.getFriendsAnswersByQuestion(currentUser.email, question.id,
                            (err, friends) => {
                                if (err) next(err);
                                else {
                                    //get my friends answers
                                    questionDAOModel.getAnswersLikeFriend(currentUser.email, question.id,
                                        (err, answersLikeFriend) => {

                                            questionDAOModel.getFriends(currentUser.email,
                                                (err, friendList) => {

                                                    friends.forEach(friend => {
                                                        //for each friend check if we have answered like him
                                                        const answered = answersLikeFriend.filter(answer => (answer.email_friend == friend.username_2)).length;
                                                        //actualizamos adivinar
                                                        if (!answered) friend.guess = true;
                                                        else {
                                                            friend.guess = false;
                                                            //for each friend check if the answer it's the same or not
                                                            const correct = answersLikeFriend.filter(answer => (answer.id_answer == friend.id_answer)).length;
                                                            friend.correct = correct;
                                                        }
                                                    });

                                                    //update friends attributes
                                                    friends.forEach(friend => {
                                                        friendList.forEach(elem => {
                                                            if (friend.username_2 == elem.email) {
                                                                friend.username = elem.username;
                                                                friend.email = elem.email;
                                                                friend.id = elem.id;
                                                            }
                                                        })
                                                    })
                                                    request.session.question = question;
                                                    response.render('question-show',
                                                        { question, currentUser, reply, users: friends });
                                                })
                                        })
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


    questionDAOModel.getAnswersByQuestion(request.params.id, undefined,
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
        questionDAOModel.addAnswer(question.id, request.body.answer_body,
            (err, id_answer) => {
                if (err) next(err);
                else {
                    questionDAOModel.addUserAnswer(currentUser.email, id_answer,
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
        questionDAOModel.addUserAnswer(currentUser.email, option,
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
    const currentUser = request.session.currentUser;
    const question = request.session.question;

    userModel.getUserById(request.params.id,
        (err, friend) => {
            if (err) next(err);
            else {
                request.session.friend = friend;

                //get the chosen answer given an user and question 
                questionDAOModel.checkQuestionIsAnswer(friend.email, question.id, 
                    (err, friendAnswer)=> {
                        if(err) next(err);
                        else {
                            //get all options
                            questionDAOModel.getAnswersByQuestion(question.id, question.initial_options,
                                (err, answers) => {
                                    if (err) next(err);
                                    else {
                                        //get all options except user option
                                        answers = answers.filter(elem => elem.id_answer != friendAnswer[0].id_answer);
                                        answers.sort(() => .5 - Math.random()).splice(0, answers.length - 1);
                                        //push the user option
                                        answers.push(friendAnswer[0]);
                                        //shuffle options
                                        answers.sort(function() {
                                            return .5 - Math.random();
                                          });
                                        response.render('question-view-friend', { answers, question, currentUser, friend });
                                    }
                                })

                        }
                })

                
            }
        })
}

/**
 * Handles the answer like friend POST PETITION
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function handleAnswerLikeFriendPost(request, response, next) {
    const currentUser = request.session.currentUser;
    const answer_id = request.body.option;
    const question = request.session.question;
    const friend = request.session.friend;

    questionDAOModel.addAnswerLikeFriend(currentUser.email, friend.email, question.id, answer_id,
        (err, correctInsert) => {
            if (err) next(err);
            else {
                if (!correctInsert) next(err);
                else {
                    questionDAOModel.checkQuestionIsAnswer(friend.email, question.id,
                        (err, friendAnswer) => {
                            if (err) next(err);
                            else {
                                if (answer_id == friendAnswer[0].id_answer) {
                                    questionDAOModel.addPuntuation(currentUser.puntuation + 50, currentUser.id,
                                        (err, correctUpdate) => {
                                            if (err) next(err);
                                            else {
                                                if (!correctUpdate) next(err);
                                                else {
                                                    request.session.currentUser.puntuation += 50;
                                                    response.redirect(`show-question/${question.id}`);
                                                }
                                            }
                                        })
                                }
                                else response.redirect(`show-question/${question.id}`);
                            }
                        })
                }
            }
        })
}
module.exports = {
    handleIndex,
    handleRandomQuestions,
    handleAddQuestion,
    handleAddQuestionPost,
    handleShowQuestion,
    handleAnswerQuestion,
    handleAnswerQuestionPost,
    handleAnswerLikeFriend,
    handleAnswerLikeFriendPost
}; 