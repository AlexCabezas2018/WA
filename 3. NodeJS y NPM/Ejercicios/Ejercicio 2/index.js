const DAO = require("./dao");

let dao = new DAO('localhost', 'root', '', 'AW_Exercises');

// /*CREATE USERS*/
// let user1 = {id: 1, nombre: 'Alex', correo: 'correo1@gmail.com', telefono: '1234231'};
// let user2 = {id: 2, nombre: 'Manuel', correo: 'correo1@gmail.com', telefono: '1234231'}


// /*INSERT USERS*/
// dao.insertarUsuario(user1, function_insert_done)
// dao.insertarUsuario(user2, function_insert_done)

// /*FIND USER*/
// dao.buscarUsuario('Alex', function_find_done);

// /*SEND MESSAGE*/
// dao.enviarMensaje(user1, user2, "Hola mundo!", function_send_message_done);

// /*SHOW INBOX*/
// dao.bandejaEntrada(user2, function_inbox_done);

//dao.terminarConexion(err => {console.log((err) ? err.message: "EXITO")})


/* CALLBACK FUNCTIONS */
function function_insert_done(err) {
    if(err) console.log("[ERROR] " + err.message);
    else {
        console.log("[INFO] USUARIO INSERTADO CORRECTAMENTE")
    };
}

function function_find_done(err, results) {
    if(err) console.log("[ERROR] " + err.message);
    else {
        for(let user of results) {
            console.log(user);
        }
    }
}

function function_send_message_done(err) {
    if(err) console.log("[ERROR] " + err.message);
    else console.log("[INFO] MENSAJE ENVIADO CORRECTAMENTE");
}

function function_inbox_done(err, messages) {
    if(err) console.log("[ERROR] " + err.message);
    else {
        for(let msg of messages) {
            console.log(msg);
        }
    }
}

