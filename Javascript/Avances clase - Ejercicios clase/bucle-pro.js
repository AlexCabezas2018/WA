"use sctrict";

//1
function producto(x1, x2) {
    if (typeof(x1) == 'number' && typeof(x2) == 'number') return x1 * x2;
    if (typeof(x1) == 'number' && x2 instanceof Array){
        let toReturn = [];
        for(number in x2) toReturn[number] = x2[number] * x1; return toReturn;
    } 
    if(x1 instanceof Array && typeof(x2) == 'number'){
        let toReturn = [];
        for(number in x1) toReturn[number] = x1[number] * x2; return toReturn;
    }
    if(x1 instanceof Array && x2 instanceof Array) {
        if(x1.length == x2.length){
            let prodEscalar = 0;
            for(let index in x1) prodEscalar += (x1[index] * x2[index]);
            return prodEscalar;
        }
        else throw new Error("Error: los vectores no miden lo mismo")
    }

    throw new Error("No es ninguno de los casos anteriores");
}

try {
    console.log(producto(2, 4));
    console.log(producto(2, [2, 4, 6]));
    console.log(producto([3, 6, 9], 3));
    console.log(producto([2, 4, 6], [3, 6, 9]));
    console.log(producto("Hola mundo", 3));
    console.log(producto(3, "Hola mundo"));
    console.log(producto([1, 2, 3], "Hola"));
    console.log(producto([1, 2, 3], [1, 2, 3, 4]));
} catch(Err) {
    console.log(Err.message)
}

//2
//todo: Comprobar que es un array y que ese array tiene funciones dentro.
function checkArguments(f){
    if(!(f instanceof Array)) throw new Error(`${f} is not an Array`);
    for(let funct of f) {
        if(typeof(funct) != 'function') throw new Error(`${func} is not a function!`);
    }
}

function sequence1(functions, x) {
    checkArguments(functions)
    let x1 = x;
    for(let funct of functions) {
        x1 = funct(x1)
    }

    return x1;
}

function sequence2(functions, x) {
    checkArguments(functions)
    let x1 = x;
    for(let funct of functions) {
        x1 = funct(x1)
        if (x1 == undefined) return undefined;
    }

    return x1;
}

function sequence3(functions, x, inverseOrder = false){
    checkArguments(functions);
    if(!inverseOrder) {
        return sequence2(functions, x);
    }
    else {
        return sequence2(functions.reverse(), x);
    }
} 

let funct1 = function(x) {
    console.log("Ejecutando funcion 1");
    return x * x;
}

let funct2 = function(x) {
    console.log("Ejecutando funcion 2");
    return 3 * x;
}

let funct3 = function(x) {
    console.log("Ejecutando funcion 3");
    return x / 2;
}

console.log(sequence3([funct1, funct2, funct3], 3, true));

//Otra forma de escribir funciones anonimas: Arrow functions.
console.log(sequence3([
    x => x * x, 
    x => x * 2,
    x => x / 2],
     4, false)
);

//Clase del 08/10

//3
function pluck(objects, fieldName) { 
    if(!(objects instanceof Array)) throw new Error(`${objects} must be an array of objects`);
    return objects.map(elem => elem[fieldName]).filter(elem => elem != undefined);
}

//Test
let personas = [
    {nombre: "Ricardo", edad: 63},
    {nombre: "Paco", edad: 55},
    {nombre: "Enrique", edad: 32},
    {nombre: "Adrián", edad: 34},
    {apellidos: "García", edad: 28},
];    

console.log(pluck(personas, "nombre"));
console.log(pluck(personas, "edad"));
console.log(pluck(personas, "email"));

function partition(list, condition) {
    //Condition es una funcion
    if(!(list instanceof Array)) throw new Error(`${list} is not a list!`);
    if(typeof condition != 'function') throw new Error(`${condition} is not a function`);
    let trueElems = [], falseElems = [];
    for(let elem of list) {
        if(condition(elem)) trueElems.push(elem);
        else if(!condition(elem)) falseElems.push(elem);
        else throw new Error("Unexpected error")
    }

    return [trueElems, falseElems];
}

console.log(partition(personas, pers => pers.edad >= 60));

function groupBy(array, f) {
    let groupedSet = {};
    if(!(array instanceof Array)) throw new Error(`${array} is not a list!`);
    if(typeof f != 'function') throw new Error(`${f} is not a function`);
    for(let elem of array) {
        let result = f(elem);
        if(groupedSet[result] == undefined) {
            groupedSet[result] = [];
        }
        groupedSet[result].push(elem);
    }

    return groupedSet;
}

console.log(groupBy(["Mario", "Elvira", "María", "Estela", "Fernando"], str => str[0]))

//where

//clase 15/10

function mapLengths(array) {
    return array.map((elem) => elem.length);
}

console.log(mapLengths(["Manuel", "es", "calvo"]));

function filterInf(array) {
    return array.filter((elem, index, arr) => index < arr.length / 2)
}

console.log(filterInf([1, 2, 3, 4, 5, 6, 7, 8, 9]))

function everyFunction(array) {
    if(!(array instanceof Array)) return false;
    if(array.length == 0) return false;
    return array.every(elem => typeof(elem) == 'function');
}

console.log(everyFunction([x => x + 1, x => x - 1]));
console.log(everyFunction(["Hola", x => x * 2]));
console.log(everyFunction([]));

function someUndefined(arr) {
    return arr.some(elem => typeof(elem) == 'undefined');
}

console.log(someUndefined([undefined, "hola"]));
console.log(someUndefined(["hola", "no"]));

function reduceSquare(arr) {
    //suma de los cuadrados
    return arr.reduce((ac, n) => ac + (n*n))
}

console.log(reduceSquare([2, 4, 6], 0)) //4 + 16 + 36 = 54