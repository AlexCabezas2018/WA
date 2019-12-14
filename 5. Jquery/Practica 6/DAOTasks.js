"use strict";
const mysql = require("mysql");

class DAOTasks {
    constructor(pool) {
        this.pool = pool
        this.exceptions = {
            connection_error: "Error de conexion a la base de datos",
            query_error: "Error de acceso a la base de datos"
        }
    }

    /**
     * Devuelve todas las tareas de un usuario, junto con sus tags
     * @param {*} email 
     * @param {*} callback 
     */
    getAllTasks(email, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                let GET_TASKS_BY_EMAIL = 'SELECT * FROM task LEFT JOIN tag ON(task.id = tag.taskid) WHERE task.user=?';
                conn.query(GET_TASKS_BY_EMAIL, [email], (err, rows) => {
                    conn.release();
                    if (err) callback(new Error(this.exceptions.query_error), undefined);
                    else {
                        //Reagrupamos las tags por id de tarea
                        let tasks = {};
                        for (let item of rows) {
                            if (!tasks[item.id])
                                tasks[item.id] = {
                                    id: item.id,
                                    text: item.text,
                                    done: item.done,
                                    tags: []
                                };
                            if (item.tag) tasks[item.id].tags.push(item.tag); //Puede que una tarea no tenga tags, la BD lo considera null
                        }

                        //Creamos un array con el contenido de que cada entrada del objeto con las tags reagrupadas
                        callback(null, Object.keys(tasks).reduce((ac, elem) => {
                            ac.push(tasks[elem]); return ac;
                        }, []));
                    }
                });
            }
        });
    }

    /**
     * Inserta una tarea a un usuario, dado un email. 
     * @param {*} email 
     * @param {*} task 
     * @param {*} callback 
     */
    insertTask(email, task, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error));
            else {
                let INSERT_TASK = 'INSERT INTO task VALUES(?, ?, ?, ?)';
                conn.query(INSERT_TASK, [null, email, task.text, task.done],
                    (err, result) => {
                        conn.release();
                        if (err) callback(new Error(err.message));
                        else {
                            if (task.tags.length > 0) {
                                let taskId = result.insertId;
                                let query_tags = "(?,?), ".repeat(task.tags.length - 1) + "(?,?)";
                                let INSERT_TAGS = "INSERT INTO tag VALUES " + query_tags;
                                //Creamos un array del estilo: [1, tag1, 1, tag2, 1, tag3, ...]
                                let tags_param = task.tags.reduce((ac, elem) => {
                                    ac.push(taskId);
                                    ac.push(elem);
                                    return ac;
                                }, []);
                                conn.query(INSERT_TAGS, tags_param,
                                    (err, result) => {
                                        if (err) callback(new Error(err.message));
                                        else callback(null);
                                    });
                            }
                            else callback(null);
                        }
                    });
            }
        });
    }

    /**
     * Marca la tarea como realizada
     * @param {*} taskId 
     * @param {*} callback 
     */
    markTaskDone(taskId, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error));
            else {
                let MARK_TASK_AS_DONE = "UPDATE task SET done = 1 WHERE id=?";
                conn.query(MARK_TASK_AS_DONE, [taskId], (err, result) => {
                    conn.release();
                    if (err) callback(new Error(this.exceptions.query_error));
                    else callback(null);
                })
            }
        })
    }

    /**
     * Elimina todas las tareas realizadas (done = 1) del usuario, dado un email
     * @param {*} email 
     * @param {*} callback 
     */
    deletedCompleted(email, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error));
            else {
                /* No es necesario borrar las tags de cada tarea, puesto que la tarea tiene borrado en cascada */
                let DELETE_DONE_TASKS_BY_EMAIL = 'DELETE FROM task WHERE user = ? AND done = 1';
                conn.query(DELETE_DONE_TASKS_BY_EMAIL, [email], (err, result) => {
                    conn.release();
                    if (err) callback(new Error(this.exceptions.query_error));
                    else callback(null);
                })
            }
        })
    }

}

module.exports = DAOTasks;