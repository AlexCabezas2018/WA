const mysql = require('mysql');
const config = require('../config');

class QuestionsModel {
    constructor() {
        this.pool = mysql.createPool(config.mySQLConfig);
        this.exceptions = {
            connection_error: "[ERROR] Error de conexion a la base de datos",
            query_error: "[ERROR]Error de acceso a la base de datos",
        }
        this.queries = {
            RANDOM_QUESTIONS: "SELECT * FROM questions ORDER BY RAND() LIMIT 5",
            INSERT_QUESTION: "INSERT INTO questions VALUES (null, ?, ?)",
            FIND_QUESTION_BY_ID: "SELECT * FROM questions WHERE id = ?",
            FIND_ANSWERS_BY_QUESTION: "SELECT id as id_answer, id_question, answer_body FROM answers WHERE id_question = ? ORDER BY RAND()",
            INSERT_USER_ANSWER: "INSERT INTO user_answers VALUES (?,?)",
            GET_ANSWER_BY_USER_AND_QUESTION: "SELECT * FROM user_answers JOIN answers ON user_answers.id_answer = answers.id JOIN questions ON answers.id_question = questions.id WHERE username = ? and id_question = ?",
            INSERT_ANSWER: "INSERT INTO answers VALUES (null,?,?)",
            GET_FRIENDS_ANSWERS: "SELECT email, username_2, id_answer FROM users JOIN friendships ON users.email = friendships.username_1 JOIN user_answers ON friendships.username_2 = user_answers.username JOIN answers ON user_answers.id_answer = answers.id WHERE email = ? AND id_question = ?",
            GET_ANSWER_LIKE_FRIEND: "SELECT * FROM answer_like_friend where email_user = ? AND id_question = ?",
            INSERT_ANSWER_LIKE_FRIEND: "INSERT INTO answer_like_friend VALUES (?,?,?,?)",
            GET_FRIENDS: "SELECT id, email, username FROM friendships JOIN users on friendships.username_2 = users.email WHERE username_1 = ?",
            ADD_PUNTUATION: "UPDATE users set puntuation= ? WHERE id = ? "
        }
    }

    /**
     * Get 5 random questions from Database
     * @param {Function} callback 
     */
    getRandomQuestions(callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.RANDOM_QUESTIONS,
                    (err, rows) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else callback(undefined, rows);
                    })
            }
        })
    }

    /**
     * Create a new question given the question body and the options
     * @param {String} question 
     * @param {Array} options 
     * @param {Function} callback 
     */
    addQuestion(question, options, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.INSERT_QUESTION, [question, options.length],
                    (err, result) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error));
                        else {
                            //create query to add answers
                            let questionId = result.insertId;
                            let answer_options = "(null,?,?), ".repeat(options.length - 1) + "(null,?,?)";
                            let ADD_ANSWER = "INSERT INTO answers VALUES " + answer_options;
                            let answer_param = options.reduce((ac, elem) => {
                                ac.push(questionId);
                                ac.push(elem);
                                return ac;
                            }, []);
                            //execute query
                            conn.query(ADD_ANSWER, answer_param, (err, result) => {
                                if (err) callback(new Error(this.exceptions.query_error), undefined);
                                else callback(undefined, true);
                            })
                        }
                    }
                )
            }
        })
    }

    /**
     * Returns a question given an Id
     * @param {int} id 
     * @param {Function} callback 
     */
    getQuestionById(id, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.FIND_QUESTION_BY_ID, [id],
                    (err, question) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else callback(undefined, question[0]);
                    })
            }
        })
    }

    /**
     * Get answers given a question
     * @param {Int} id_question 
     * @param {Function} callback 
     */
    getAnswersByQuestion(id_question, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.FIND_ANSWERS_BY_QUESTION, [id_question],
                    (err, answers) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else callback(undefined, answers);
                    })
            }
        })
    }

    /**
     * Insert an answer from user given an email and id_answer
     * @param {*} email 
     * @param {*} id_answer 
     */
    addUserAnswer(email, id_answer, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.INSERT_USER_ANSWER, [email, id_answer],
                    (err, result) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else callback(undefined, true);
                    })
            }
        })
    }

    /**
     * Check if a question has been answered given an email and the question_id
     * @param {*} email 
     * @param {*} question_id 
     * @param {*} callback 
     */
    checkQuestionIsAnswer(email, question_id, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.GET_ANSWER_BY_USER_AND_QUESTION, [email, question_id],
                    (err, rows) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else callback(undefined, rows);
                    })
            }
        })
    }

    /**
     * Add new answer given a question_id
     * @param {*} question_id 
     * @param {*} answer_body 
     * @param {*} callback 
     */
    addAnswer(question_id, answer_body, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.INSERT_ANSWER, [question_id, answer_body],
                    (err, result) => {
                        conn.release();
                        if (err) callback(new Error(err.message), undefined);
                        else callback(undefined, result.insertId);
                    })
            }
        })
    }

    /**
     * Get list of friends who has answered the given question
     * @param {*} email 
     * @param {*} question_id 
     * @param {*} callback 
     */
    getFriendsAnswersByQuestion(email, question_id, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.GET_FRIENDS_ANSWERS, [email, question_id], (err, users) => {
                    conn.release();
                    if (err) callback(new Error(this.exceptions.query_error), undefined);
                    else callback(undefined, users);
                })
            }
        })
    }

    /**
     * Return the answers from user like friend given the user and question
     * @param {*} emailUser 
     * @param {*} emailFriend 
     * @param {*} id_answer 
     * @param {*} callback 
     */
    getAnswersLikeFriend(emailUser, id_question, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.GET_ANSWER_LIKE_FRIEND, [emailUser, id_question],
                    (err, answers) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else callback(undefined, answers);
                    })
            }
        })

    }

    /**
     * Insert a new row in answer_like_friend given user email, friend email, question and answer
     * @param {*} emailUser 
     * @param {*} emailFriend 
     * @param {*} id_question 
     * @param {*} id_answer 
     * @param {*} callback 
     */
    addAnswerLikeFriend(emailUser, emailFriend, id_question, id_answer, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.INSERT_ANSWER_LIKE_FRIEND, [emailUser, emailFriend, id_question, id_answer],
                    (err, result) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else callback(undefined, true);
                    })
            }
        })
    }

    /**
     * Return list of friends given an user
     * @param {*} email 
     * @param {*} callback 
     */
    getFriends(email, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.GET_FRIENDS, [email],
                    (err, friends) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else callback(undefined, friends);
                    })
            }
        })
    }

    /**
     * Update puntutation givcen an user and puntuation
     * @param {*} puntuation 
     * @param {*} email 
     * @param {*} callback 
     */
    addPuntuation(puntuation, id, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.ADD_PUNTUATION, [puntuation, id],
                    (err, result) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else callback(undefined, true);
                    })
            }
        })
    }

}

module.exports = QuestionsModel;