"use strict";

const mysql = require("mysql");

// pool.getConnection((err, connection) => {
//     if(err) console.log(`Error al obtener la conexión: ${err.message}`);
//     else {
//         connection.query("SELECT Nombre, Apellidos FROM Contactos",
//             (err, filas) => {
//                 connection.release();
//                 if(err) console.log(`Error en la cosulta: ${err.message}`);
//                 else {
//                     filas.forEach(element => {
//                         console.log(`${element.Nombre}, ${element.Apellidos}`)
//                     });
//                 }
//             }
//         );
//     }
// })

// pool.getConnection((err, conn) => {
//     if(err) console.log(err.message);
//     else {
//         const sql = "INSERT INTO Contactos(Nombre, Apellidos) "
//                 + "VALUES('Diana', 'Díaz')"
//         conn.query(sql, (err, result) => {
//             if(err) console.log(err);
//             else {
//                 console.log(result.insertId);
//                 console.log(result.affectedRows);
//             }
//         })
//     }
// })

/*Ejercicio 4*/

function leerArticulos(callback) {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'AW_Exercises'
    });
    pool.getConnection((err, conn) => {
        if(err) console.log(err.message);
        else {
            conn.query("SELECT * FROM articulos JOIN palabrasclave ON(articulos.id = palabrasclave.idArticulo)",
            (err, results) => {
                conn.release();
                if(err) callback(new Error(err.message), undefined);
                else {
                    let articles = {};
                    let toCallback = [];
                    results.forEach(element => {
                        if(articles[element.Id] == undefined) {
                            articles[element.Id] = {
                                "Id": element.Id, 
                                "titulo": element.Titulo, 
                                "fecha": element.Fecha.toDateString(),
                                "palabrasClave": []
                            }
                        }
                        articles[element.Id].palabrasClave.push(element.PalabraClave);
                    });

                    toCallback = Object.keys(articles).reduce((ac, id) => {
                        ac.push(articles[id]);
                        return ac;
                    }, []);

                    callback(null, toCallback);
                                
                }
            })
        }
    })
}

leerArticulos((err, results) => {
    if(err) console.log(err.message);
    else {
        results.forEach(elem => console.log(elem));
    }
});


/* Ejercicio 1*/
