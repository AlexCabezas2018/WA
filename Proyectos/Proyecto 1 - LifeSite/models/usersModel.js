const mysql = require('mysql');

const mysqlOptions = {
    hostname: 'localhost',
    user: 'root',
    password: '',
    database: "lifesite"
};

class usersModel {
    constructor() {
        this.pool = mysql.createPool(mysqlOptions);
        this.exceptions = {
            connection_error: "[ERROR] Error de conexion a la base de datos",
            query_error: "[ERROR]Error de acceso a la base de datos",
            user_exists: "[ERROR] Ya existe una cuenta con este email"
        }
        this.queries = {
            FIND_USER: 'SELECT * FROM users WHERE email = ? AND pass = ?',
            FIND_BY_EMAIL: 'SELECT id, email FROM users WHERE email = ?',
            FIND_BY_ID: 'SELECT * FROM users WHERE id = ?',
            ADD_USER: 'INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            GET_FRIENDS: 'SELECT username, id, profile_img FROM friendships JOIN users ON users.email = friendships.username_2 WHERE username_1 = ?',
            GET_REQUESTS: 'SELECT username, id, profile_img, email FROM friend_requests JOIN users ON users.email = friend_requests.username_from WHERE username_to = ?',
            GET_MY_REQUESTS: 'SELECT username_to FROM friend_requests  WHERE username_from = ?',
            UPDATE_USER: 'UPDATE users SET pass=?, username=?, gender=?, birth_date=?, profile_img=? WHERE email=? ',
            GET_USERS_BY_NAME: 'SELECT id, username, profile_img, email FROM users WHERE username LIKE ? AND email <> ?',
            ADD_REQUEST: 'INSERT INTO friend_requests VALUES (?,?)',
            DELETE_REQUEST: 'DELETE FROM friend_requests WHERE username_to = ? AND username_from = ?',
            INSERT_FRIEND: 'INSERT INTO friendships VALUES (?,?)'
        }
    }

    /**
     * Check if its a correct login
     * @param {String} email 
     * @param {String} password 
     * @param {function} callback 
     */
    checkCredentials(email, password, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.FIND_USER, [email, password],
                    (err, rows) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        if (rows.length == 0) callback(null, null);
                        else callback(null, rows[0])
                    }
                )
            }
        });
    }

    /**
     * Add new user 
     * @param {Object} user 
     * @param {Function} callback 
     */
    createUser(user, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.FIND_BY_EMAIL, [user.email],
                    (err, rows) => {
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else {
                            if (rows.length != 0) callback(new Error(this.exceptions.user_exists, undefined));
                            else {
                                console.log(user)
                                conn.query(this.queries.ADD_USER,
                                    [null, user.email, user.pass, user.name,
                                        user.gender, user.birth_date, user.profile_img, 0],
                                    (err, result) => {
                                        conn.release();
                                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                                        else {
                                            callback(null, result.insertId);
                                        }
                                    }
                                );
                            }
                        }
                    }
                );
            }
        });
    }

    /**
     * 
     * @param {Int} id 
     * @param {Function} callback 
     */
    getUserById(id, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.FIND_BY_ID, [id],
                    (err, rows) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else {
                            if (rows[0] != null) callback(null, rows[0]);
                            else callback(null, null);
                        }
                    })
            }
        })
    }

    /**
     * Return a list of friends given an email
     * @param {String} email 
     * @param {Function} callback 
     */
    getFriendsByEmail(email, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error),undefined);
            else{
                conn.query(this.queries.GET_FRIENDS, [email,email],
                    (err, rows) => {
                        if(err) callback(new Error(this.exceptions.query_error), undefined);
                        else callback(undefined, rows);
                })
            }
        })
    }

    /**
     * Returns a list of users which name contains the given name
     * @param {String} name 
     * @param {Function} callback 
     */
    getUsersByName(name, email, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.GET_USERS_BY_NAME, ['%' + name + '%', email],
                    (err, rows) => {
                        if (err) callback(new Error(err.message), undefined);
                        else callback(undefined, rows);
                    }
                )
            }
        })
    }

    /**
     * Update the user given an email
     * @param {*} user 
     * @param {*} callback 
     */
    updateUser(user, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.UPDATE_USER,
                    [user.pass, user.name, user.gender, user.birth_date, user.profile_img, user.email],
                    (err, rows) => {
                        if (err) callback(new Error(err.message), undefined);
                        else callback(undefined, true);
                    })
            }
        })
    }

    /**
     * Get a list of friends requests given an email
     * @param {String} email 
     * @param {Function} callback 
     */
    getRequestsByEmail(email, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.GET_REQUESTS, [email],
                    (err, rows) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else callback(null, rows);
                    }
                )
            }
        });
    }


    /**
     * Get a list of friends requests send for me given an email
     * @param {String} email 
     * @param {Function} callback 
     */
    getMyRequestsByEmail(email, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.GET_MY_REQUESTS, [email],
                    (err, rows) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else callback(null, rows);
                    }
                )
            }
        });
    }

    addRequest(id_from, id_to, callback){
        this.pool.getConnection((err,conn)=>{
            if (err) callback(new Error(this.exceptions.connection_error),undefined);
            else conn.query(this.queries.ADD_REQUEST, [id_from,id_to],
                (err,result)=>{
                    if(err) callback(new Error(err.message),undefined);
                    else callback(undefined,true);
            })
        })
    }

    deleteRequest(email_from, email_to, callback){
        this.pool.getConnection((err, conn) => {
            if(err) callback(new Error(this.exceptions.connection_error), undefined);
            else{
                conn.query(this.queries.DELETE_REQUEST,[email_from, email_to], (err, result) => {
                    if(err) callback(new Error(this.exceptions.query_error),undefined);
                    else callback(undefined, true);
                })
            }
        })
    }

    addFriend(email_1, email_2, callback) {
        this.pool.getConnection((err, conn) => {
            if(err) callback(new Error(this.exceptions.connection_error), undefined);
            else{
                conn.query(this.queries.INSERT_FRIEND, [email_1, email_2], (err, result) => {
                    if(err) callback(new Error(this.exceptions.query_error),undefined);
                    else callback(undefined, true);
                })
            }
        })
    }

}


module.exports = {
    usersModel
};