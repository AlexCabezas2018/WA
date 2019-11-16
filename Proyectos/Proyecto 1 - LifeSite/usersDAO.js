const mysql = require('mysql');

const mysqlOptions = {
    hostname: 'localhost',
    user: 'root',
    password: '',
    database: "LifeSite"
};

class usersDAO {
    constructor() {
        this.pool = mysql.createPool(mysqlOptions);
        this.exceptions = {
            connection_error: "[ERROR] Error de conexion a la base de datos",
            query_error: "[ERROR]Error de acceso a la base de datos",
            user_exists: "[ERROR] Ya existe una cuenta con este email"
        }
        this.queries = {
            FIND_USER: 'SELECT id FROM users WHERE email = ? AND pass = ?',
            FIND_BY_EMAIL: 'SELECT id, email FROM users WHERE email = ?',
            FIND_BY_ID: 'SELECT * FROM users WHERE id = ?',
            ADD_USER: 'INSERT INTO users VALUES(NULL, ?, ?, ?, ?, ?, ?)',
            GET_FRIENDS: 'SELECT * FROM friendships WHERE username_1 = ?',
            GET_USERS_BY_NAME: 'SELECT id, name, profile_img FROM users WHERE name LIKE \'%?%\'',
            UPDATE_USER: 'UPDATE users set pass=?, name=?, gender=?, birth_date=?,profile_img=? WHERE email=?'
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
                        else callback(null, rows[0].id)
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
                                conn.query(this.queries.ADD_USER,[null,user.email, user.pass,user.name, user.gender, user.birth_date, user.profile_img],
                                    (err, result) => {
                                        conn.release();
                                        if (err) callback(new Error(this.queries.query_error),undefined);
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

    getUserById(id, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.FIND_BY_ID, [id],
                    (err, rows) => {
                        conn.release();
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else {
                            if(rows[0]!=null) callback(null, rows[0]);
                            else callback (null,null);
                        }
                    })
            }
        })
    }

    /**
     * Get a list of friends given an email
     * @param {String} email 
     * @param {Function} callback 
     */
    getFriendsByEmail(email, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.GET_FRIENDS, [email],
                    (err, friends) => {
                        conn.release();
                        if (err) callback(new Error(this.queries.query_error), undefined);
                        else callback(null, friends);
                    }
                )
            }
        });
    }

    /**
     * Returns a list of users which name contains the given name
     * @param {String} name 
     * @param {Function} callback 
     */
    getUsersByName(name, callback) {
        this.this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(GET_USERS_BY_NAME, [name],
                    (err, rows) => {
                        if (err) callback(new Error(this.exceptions.query_error), undefined);
                        else callback(undefined, rows);
                    }
                )
            }
        })
    }

    updateUser(user,callback){
        this.pool.getConnection((err,conn)=>{
            if(err) callback(new Error(this.exceptions.connection_error),undefined);
            else{
                conn.query(UPDATE_USER,[user.pass,user.name,user.gender,user.birth_date,user.profile_img,user.email],
                    (err,rows)=>{
                        if(err) callback(new Error(this.exceptions.query_error),undefined);
                        else callback (undefined,user.id);
                    })
            }
        })
    }
}

module.exports = usersDAO;