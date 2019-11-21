//Práctica 2
//Aplicaciones Web
//Alejandro Cabezas Garríguez y Manuel Monforte Escobar

"use strict";

//Ejercicio 1
function getToDoTask(tasks) {
  if (!(tasks instanceof Array)) return [];
  return tasks.reduce((ac, elem) => {
    if (elem["done"] == undefined || !elem["done"]) ac.push(elem["text"]);
    return ac;
  }, []);
}

//Ejercicio 2
function findByTag(tasks, tag) {
  if (!(tasks instanceof Array && typeof tag == "string")) return [];
  return tasks.reduce((ac, elem) => {
    if (elem["tags"].includes(tag)) ac.push(elem);
    return ac;
  }, []);
}

//Ejercicio 3
function findByTags(tasks, tags) {
  if (!(tasks instanceof Array && tags instanceof Array)) return [];
  return tasks.reduce((ac, task) => {
    if (tags.some(tag => task["tags"].includes(tag))) ac.push(task);
    return ac;
  }, []);
}

//Ejercicio 4
function countDone(tasks) {
  if (!(tasks instanceof Array)) return 0;
  return tasks.reduce((ac, task) => {
    if (task["done"] != undefined && task["done"]) ac++;
    return ac;
  }, 0);
}

//Ejercicio 5
function createTask(texto) {
  let tags = [],
    text = "";
  if (typeof texto != "undefined" && typeof texto == "string" && texto != "") {
    tags = (texto.match(/@\w+/g) || []).map(tag => tag.replace("@", "")); //Queremos cualquier cadena que coincida con que empieza por arroba y va seguido de cualquier cadena de caracteres hasta llegar al espacio
    text = texto.replace(/@\w+/g, "").trim().replace(/\s+/g, ' '); //1: "Ir a @deporte      entrenar" --> "Ir a      entrenar"
                                                                    //2: "Ir a      entrenar" --> "Ir a entrenar" (quitamos espacios entre palabras en el texto).
  }

  return { text, tags };
}

module.exports = {
  getToDoTask,
  findByTag,
  findByTags,
  countDone,
  createTask
}
