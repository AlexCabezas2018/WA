//Práctica 2
//Aplicaciones Web
//Alejandro Cabezas Garríguez y Manuel Monforte Escobar

"use strict";

let listaTareas = [
  { text: "Preparar práctica AW", tags: ["AW", "practica"] },
  { text: "Mirar fechas congreso", done: true, tags: [] },
  { text: "Ir al supermercado", tags: ["personal"] },
  { text: "Mudanza", done: false, tags: ["personal"] }
];

//Ejercicio 1
function getToDoTask(tasks) {
  if (!(tasks instanceof Array)) return [];
  return tasks.reduce((ac, elem) => {
    if (elem["done"] == undefined || !elem["done"]) ac.push(elem["text"]);
    return ac;
  }, []);
}

//Testing del ejercicio 1
console.log("=============================================");
console.log("Ejercicio 1: getToDoTask(tasks)");
console.log("=============================================");
console.log("getToDoTask(listaTareas): ", getToDoTask(listaTareas));
console.log("getToDoTask([]): ", getToDoTask([]));
console.log('getToDoTask("No soy una lista"): ', getToDoTask("No soy una lista"));
console.log("=============================================\n");

//Ejercicio 2
function findByTag(tasks, tag) {
  if (!(tasks instanceof Array && typeof tag == "string")) return [];
  return tasks.reduce((ac, elem) => {
    if (elem["tags"].includes(tag)) ac.push(elem);
    return ac;
  }, []);
}

//Testing del ejercicio 2
console.log("Ejercicio 2: findByTag(tasks, tag)");
console.log("=============================================");
console.log('findByTag(listaTareas, "personal")', findByTag(listaTareas, "personal"));
console.log('findByTag(listaTareas, "practica")', findByTag(listaTareas, "practica"));
console.log('findByTag(listaTareas, "AW"): ', findByTag(listaTareas, "AW"));
console.log('findByTag(listaTareas, "universidad"): ', findByTag(listaTareas, "universidad"));
console.log('findByTag(listaTareas, ""): ', findByTag(listaTareas, ""));
console.log('findByTag("No soy una lista", "personal"): ', findByTag("No soy una lista", "personal"));
console.log("findByTag([], { soy_string: false }): ", findByTag([], { soy_string: false }));
console.log('findByTag("No soy una lista", { soy_string: false }): ', findByTag("No soy una lista", { soy_string: false }));
console.log("=============================================\n");

//Ejercicio 3
function findByTags(tasks, tags) {
  if (!(tasks instanceof Array && tags instanceof Array)) return [];
  return tasks.reduce((ac, task) => {
    if (tags.some(tag => task["tags"].includes(tag))) ac.push(task);
    return ac;
  }, []);
}

//Testing del ejercicio 3
console.log("Ejercicio 3: findByTags(tasks, tags)");
console.log("=============================================");
console.log('findByTags(listaTareas, ["personal", "practica"]): ', findByTags(listaTareas, ["personal", "practica"]));
console.log('findByTags(listaTareas, ["AW", "practica"]): ', findByTags(listaTareas, ["AW", "practica"]));
console.log('findByTags(listaTareas, ["personal"]): ', findByTags(listaTareas, ["personal"]));
console.log("findByTags(listaTareas, []): ", findByTags(listaTareas, []));
console.log('findByTags("No soy una lista", "Yo tampoco")', findByTags("No soy una lista", "Yo tampoco"));
console.log("=============================================\n");

//Ejercicio 4
function countDone(tasks) {
  if (!(tasks instanceof Array)) return 0;
  return tasks.reduce((ac, task) => {
    if (task["done"] != undefined && task["done"]) ac++;
    return ac;
  }, 0);
}

//Testing ejercicio 4
let listaTareas_test = [
  { text: "Preparar práctica AW", done: true, tags: ["AW", "practica"] },
  { text: "Mirar fechas congreso", done: true, tags: [] },
  { text: "Ir al supermercado", done: true, tags: ["personal"] },
  { text: "Mudanza", done: false, done: true, tags: ["personal"] }
];

console.log("Ejercicio 4: countDone(tasks)");
console.log("=============================================");
console.log("countDone(listaTareas): ", countDone(listaTareas)); //1
console.log("listaTareas_test: ", listaTareas_test);
console.log("countDone(listaTareas_test) cuatro veces, cada vez con una tarea menos completada: ", countDone(listaTareas_test)); //4
listaTareas_test[0]["done"] = false;
console.log(countDone(listaTareas_test)); //3
listaTareas_test[1]["done"] = false;
console.log(countDone(listaTareas_test)); //2
listaTareas_test[2]["done"] = false;
console.log(countDone(listaTareas_test)); //1
listaTareas_test[3]["done"] = false;
console.log(countDone(listaTareas_test)); //0
console.log("countDone([]): ", countDone([])); //0
console.log('countDone("No soy una lista"): ', countDone("No soy una lista")); //0
console.log("=============================================\n");

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

//Testing ejercicio 5
console.log("Ejercicio 5: createTask(task)");
console.log("=============================================");
console.log('createTask("Ir al médido @personal @salud"): ', createTask("Ir al médido @personal @salud"));
console.log('createTask("Ir a @deporte entrenar"): ', createTask("Ir a @deporte entrenar"));
console.log('createTask("@AW         @practica Preparar práctica AW": ', createTask("@AW         @practica Preparar práctica AW"));
console.log('createTask("No tiene tags                     "): ', createTask("No tiene tags                     "));
console.log('createTask("@Sin @Texto"): ', createTask("@Sin @Texto"));
console.log('createTask(""): ', createTask(""));
console.log("createTask({ soy_string: false }): ", createTask({ soy_string: false }));
console.log('createTask("No tiene               tags"): ', createTask("No tiene               tags"));
console.log("createTask(): ", createTask());
console.log("=============================================");
