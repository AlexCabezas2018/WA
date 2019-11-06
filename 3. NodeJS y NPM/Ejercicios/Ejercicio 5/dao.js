
const mysql = require("mysql");

class DAO {
    constructor(hostname, username, password, dbname) {
        this.pool = mysql.createPool({
            host: hostname,
            user: username,
            password: password,
            database: dbname
        });
    }

    /**
     * Inserta un usuario nuevo en la base de datos
     * @param {Object} usuario 
     * @param {Function} callback 
     */
    insertarUsuario(usuario, callback) {
        let INSERT_USER_QUERY = `INSERT INTO usuarios VALUES(?,?,?,?);`;
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(err.message));
            else {
                conn.query(INSERT_USER_QUERY,
                     [null, usuario.nombre, usuario.correo, usuario.telefono],
                     (err, result) => {
                        conn.release()
                        if(err) callback(new Error(err.message));
                        else {
                            usuario["id"] = result.insertId
                            callback(null);
                        }
                     })
            }
        })
    }

    /**
     * Devuelve un array de usuarios cuyo nombre contiene a la cadena str
     * @param {String} str 
     * @param {Function} callback 
     */
    buscarUsuario(str, callback) {
        let FIND_USERS_BY_NAME = 'SELECT * FROM usuarios WHERE nombre LIKE ?';
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(err.message), undefined);
            else {
                conn.query(FIND_USERS_BY_NAME,
                     ["%" + str + "%"],
                     (err, rows) => {
                        conn.release()
                        if(err) callback(new Error(err.message));
                        else {
                            callback(null, rows);
                        }
                     })
            }
        })
    }

    bandejaEntrada(usuario, callback) {
        let READ_BY_DEST_ID = `SELECT * FROM mensajes JOIN usuarios 
                                ON mensajes.idOrigen = usuarios.id WHERE idDestino=? AND leido=0`;
        this.pool.getConnection((err,conn)=>{
            if(err) callback(new Error(err.message));
            else{
                conn.query(READ_BY_DEST_ID, [usuario.id],
                    (err,rows)=>{
                        conn.release();
                        if(err) callback(new Error(err.message), undefined);
                        else callback(null, rows.map(elem => {
                            return {nombre: elem.nombre, mensaje: elem.mensaje, hora: elem.hora}
                        }));
                    })
            }
        })
    }

    /**
     * Inserta un mensaje en la tabla de mensajes.
     * @param {Object} usuarioOrigen 
     * @param {Object} usuarioDestino 
     * @param {String} mensaje 
     * @param {Function} callback 
     */
    enviarMensaje(usuarioOrigen, usuarioDestino, mensaje, callback) {
        let INSERT_MESSAGE= 'INSERT INTO mensajes VALUES(?,?,?,?,?,?);';
        this.pool.getConnection((err,conn)=>{
            if(err) callback(new Error(err.message));
            else{
                conn.query(INSERT_MESSAGE,[null, usuarioOrigen.id,usuarioDestino.id,mensaje, null, 0],
                    (err,result)=>{
                        conn.release();
                        if(err) callback(new Error(err.message));
                        else callback(null);
                    })
            }
        })
    }

    /**
     * Cierra el pool de conexiones.
     * @param {Function} callback 
     */
    terminarConexion(callback) {
        this.pool.end(err => {
            if(err) callback(new Error(err.message));
            else callback(null)
        });
    }
}

module.exports = DAO;