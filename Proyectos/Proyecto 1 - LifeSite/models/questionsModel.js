const mysql = require('mysql');

const mysqlOptions = {
    hostname: 'localhost',
    user: 'root',
    password: '',
    database: "lifesite"
};

class QuestionsModel {
    constructor() {
        this.pool = mysql.createPool(mysqlOptions);
        this.exceptions = {
            connection_error: "[ERROR] Error de conexion a la base de datos",
            query_error: "[ERROR]Error de acceso a la base de datos",
        }
        this.queries = {
            RANDOM_QUESTIONS: "SELECT * FROM questions ORDER BY RAND() LIMIT 5",
            INSERT_QUESTION: "INSERT INTO questions VALUES (null, ?)"
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
                conn.query(this.queries.INSERT_QUESTION, [question],
                    (err, result) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error));
                        else {
                            //create query to add answers
                            let questionId = result.insertId;
                            let answer_options = "(null,?,?), ".repeat(options.length - 1) + "(null,?,?)";
                            let INSERT_ANSWER = "INSERT INTO answers VALUES " + answer_options;
                            let answer_param = options.reduce((ac, elem) => {
                                ac.push(questionId);
                                ac.push(elem);
                                return ac;
                            }, []);
                            //execute query
                            conn.query(INSERT_ANSWER, answer_param, (err, result) => {
                                if (err) callback(new Error(err.message), undefined);
                                else callback(undefined, true);
                            })
                        }
                    }
                )
            }
        })
    }


}

module.exports = QuestionsModel;