const DAOUsers = require("./DAOUsers");
const DAOTasks = require("./DAOTasks");

const opts = {
    hostname: 'localhost',
    user: 'root',
    password: '',
    database: "AW_Exercises"
};

let daoUsers = new DAOUsers(opts);
let daoTasks = new DAOTasks(opts);

// daoUsers.getUserImageName("correo1", (err, path) => {
//     if(err) console.log(err.message);
//     else console.log(path);
// })

// daoUsers.isUserCorrect("correo1", "pass1", (err, exists) => {
//     if(err) console.log(err.message);
//     else console.log(exists);
// })

// daoTasks.getAllTasks("correo1", (err, tasks) => {
//     if(err) console.log(err);
//     else console.log(tasks);
// });

// daoTasks.insertTask("correo1", {
//     text: "Tarea2",
//     done: 1,
//     tags: ["tag3", "tag4", "tag5"]
// }, (err) => console.log((err) ? err: "EXITO"));

// daoTasks.markTaskDone(1,err=>{
//     if (err) console.log(err);
//     else console.log("Tarea Realizada");
// });

//daoTasks.deletedCompleted("correo1", err => console.log((err) ? err: "EXITO"));