//Práctica 2
//Aplicaciones Web
//Alejandro Cabezas Garríguez y Manuel Monforte Escobar

"use strict"

let listaTareas = [
    {text: "Preparar práctica AW", tags: ["AW", "practica"]},
    {text: "Mirar fechas congreso", done: true, tags: []},
    {text: "Ir al supermercado", tags: ["personal"]},
    {text: "Mudanza", done: false, tags: ["personal"]},
];

//Todo: Comprobar que es una lista el primer parámetro

//Ejercicio 1
function getToDoTask(tasks) {
    return tasks.reduce((ac, elem) => {
        if(elem["done"] == undefined || !elem["done"]) ac.push(elem["text"]);
        return ac;
    }, []);
}

//Testing del ejercicio 1
console.log("Ejercicio 1: getToDoTask(tasks)");
console.log(getToDoTask(listaTareas));
console.log(getToDoTask([]));


//TODO: Comprobar que el primer parámetro es lista y el segundo es string

//Ejercicio 2
function findByTag(tasks, tag) {
    return tasks.reduce((ac, elem) => {
        if(elem['tags'].includes(tag)) ac.push(elem);
        return ac;
    }, []);
}

//Testing del ejercicio 2
console.log("Ejercicio 2: findByTag(tasks, tag)");
console.log(findByTag(listaTareas, "personal"));
console.log(findByTag(listaTareas, "practica"));
console.log(findByTag(listaTareas, "AW"));
console.log(findByTag(listaTareas, "universidad"));
console.log(findByTag(listaTareas, ""));

//Ejercicio 3
//TODO: Comprobar que el primer parámetro es lista y el segundo tambien.

function findByTags(tasks, tags) {
    return tasks.reduce((ac, task) => {
        if(tags.some(tag => task['tags'].includes(tag))) ac.push(task);
        return ac;
    }, []);
}

//Testing del ejercicio 3
console.log("Ejercicio 3: findByTags(tasks, tags)");
console.log(findByTags(listaTareas, ["personal", "practica"]));
console.log(findByTags(listaTareas, ["AW", "practica"]));
console.log(findByTags(listaTareas, ["personal"]));
console.log(findByTags(listaTareas, []));

//Ejercicio 4
//TODO ...
function countDone(tasks) {
    return tasks.reduce((ac, task) => {
        if(task['done'] != undefined && task['done']) ac++;
        return ac;
    }, 0);
}

//Testing ejercicio 4
let listaTareas_test = [
    {text: "Preparar práctica AW", done: true, tags: ["AW", "practica"]},
    {text: "Mirar fechas congreso", done: true, tags: []},
    {text: "Ir al supermercado", done: true, tags: ["personal"]},
    {text: "Mudanza", done: false, done: true, tags: ["personal"]},
]

console.log("Ejercicio 4: countDone(tasks)");
console.log(countDone(listaTareas)); //1
console.log(countDone(listaTareas_test)); //4
listaTareas_test[0]['done'] = false; 
console.log(countDone(listaTareas_test)); //3
listaTareas_test[1]['done'] = false; 
console.log(countDone(listaTareas_test)); //2
listaTareas_test[2]['done'] = false; 
console.log(countDone(listaTareas_test)); //1
listaTareas_test[3]['done'] = false; 
console.log(countDone(listaTareas_test)); //0
console.log(countDone([])); //0

//Ejercicio 5
function createTask(texto) {
    let tags = [], text = "";
    if(typeof texto != 'undefined' && texto != ""){
        tags = texto.match(/@\w+/g);
        if(tags == null) tags = [];
        text = texto.replace(/@\w+/g, "").trim();
    }

    return {text, tags}
}

//Testing ejercicio 5
console.log("Ejercicio 5: createTask(task)");
console.log(createTask("Ir al médido @personal @salud"));
console.log(createTask("Ir a @deporte entrenar"));
console.log(createTask("@AW         @practica Preparar práctica AW"));
console.log(createTask("No tiene tags                     ")); 
console.log(createTask(""));
console.log(createTask());




