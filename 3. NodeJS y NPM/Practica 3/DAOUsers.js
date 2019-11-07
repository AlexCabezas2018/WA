"use strict";

const mysql = require("mysql");

class DAOUsers {
    constructor(opts) {
        this.pool = mysql.createPool(opts);
        this.exceptions = {
            connection_error: "Error de conexion a la base de datos",
            query_error: "Error de acceso a la base de datos",
            user_not_found_error: "El usuario no existe"
        }
    }

    /**
     * Comprueba si existe en la base de datos un usuario, dado el email y password
     * @param {*} email 
     * @param {*} password 
     * @param {*} callback 
     */
    isUserCorrect(email, password, callback) {
        this.pool.getConnection((err, conn) => {
            if(err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                let GET_USER_BY_EMAIL = 'SELECT email, password FROM user WHERE email = ? AND password = ?';
                conn.query(GET_USER_BY_EMAIL, [email, password], (err, rows) => {
                    conn.release();
                    if(err) callback(new Error(this.exceptions.query_error), undefined);
                    else callback(null, (rows.length > 0) ? true: false);
                });
            }
        });
    }

    /**
     * Devuelve la ruta a la image de perfil del usuario, dado su email
     * @param {*} email 
     * @param {*} callback 
     */
    getUserImageName(email, callback) {
        this.pool.getConnection((err, conn) => {
            if(err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                let GET_PATH_BY_EMAIL = 'SELECT img FROM user WHERE email = ?';
                conn.query(GET_PATH_BY_EMAIL, [email], (err, rows) => {
                    conn.release();
                    if(err) callback(new Error(this.exceptions.query_error), undefined);
                    else {
                        if(rows.length == 0) callback(new Error(this.exceptions.user_not_found_error), undefined);
                        else {
                            callback(null, rows[0].img);
                        }
                    }
                });
            }
        });
    }


}

module.exports = DAOUsers;