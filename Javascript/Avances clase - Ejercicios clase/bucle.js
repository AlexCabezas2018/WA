"use strict";

for(let k = 1; k <= 5; k++) {
    console.log(`k = ${k}`);
}

//1
console.log("Hola mundo!");

//2
//despues de alumn sobran los dos puntos
//Los atributos van seguidos de dos puntos, no igual
//Los atributos están separados por comas.
var alumno = {
    nombre: "Juan",
    apellidos: "González",
    notas: (8,8,2,4),
    dni: "4098976",
    edad:'18'
};

//3
function mayorDeTres(a, b, c) {
    if (a >= b && b >= c) return a;
    if (b >= c && b >= a) return b;
    if (c >= a && c >= b) return c;
}

console.log("El mayor numero entre 1, 7 y -2 es: " + mayorDeTres(1, 5, 7));

//4
function esDivisiblePorDos(numero) {
    return numero % 2 == 0;
}

console.log("Es el 4 divisible por dos?: " + (esDivisiblePorDos(4) ? "Si" : "No"));

//5
function cuentaAes(cadena){
    let vecesA = 0;
    for(let caracter of cadena) {
        if(caracter == 'a') vecesA++;
    }
    return `La cadena: '${cadena}' tiene ${vecesA} a's`;
}

console.log(cuentaAes('holaa aaa'));

//6
function cuentaPalabras(cadena) {
    return cadena.split(" ").length;
}

    console.log("Numero de palabras en la cadena: 'uno dos tres': " + cuentaPalabras("uno dos tres"));

//7
try {
    let x = 8;
    let y = 0;
    let z = x / y;
    throw new Error("No se puede dividir por 0");

} catch(Err) {
    console.log(Err.message);
}

//8
function undef(attr) {
    return (attr == undefined) ? "Si" : "No";
}

let test = undefined;
console.log("Es undefinded?: " + undef(test));
test = "Ya no es undefined";
console.log("Es undefinded?: " + undef(test));

//9
function mostrarTipo(atributo) {
    return typeof(atributo)
}

console.log(mostrarTipo(3));
console.log(mostrarTipo("Hola"));
console.log(mostrarTipo([1, 2, 3]));
console.log(mostrarTipo(true));

//10
function isArray(object) {
    //return Object.prototype.toString.call(object) == '[object Array]' //Forma complicada
    //return Array.isArray(object); forma easy
    return object instanceof Array;
}

console.log(isArray([1, 2, 3]));
console.log(isArray("Hola"));

//11
function primitiveOrObject(param) {
    if(!(param instanceof Object)){
        return `primitive - ${typeof(param)}`
    }
    else return "Object";
}

console.log(primitiveOrObject(2));
console.log(primitiveOrObject({name: 'Alex'}));

//12
function describirObjeto(obj) {
    if(!(obj instanceof Object)) return "No es un objeto.";
    let props = Object.keys(obj);
    console.log("Numero de propiedades: " + props.length);
    for(let prop of props) {
        console.log(prop + ": " + obj[prop]);
    }
}

describirObjeto({
    nombre: "Juan", apellido: "Pérez", edad: "34"
});

//13
function createObject(props) {
    let toReturn = {};

    for(let prop of props) {
        toReturn[prop] = "";
    }

    return toReturn;
}

console.log(createObject(["Nombre", "Apellido", "Edad"]));

//14
function createObjectWithValues(props, values) {
    let toReturn = {};
    for(let prop in props) {
        toReturn[props[prop]] = values[prop];
    }

    return toReturn;
}

console.log(createObjectWithValues(["Nombre", "Apellido", "Edad"], ["Juan", "Perez", 24]));

