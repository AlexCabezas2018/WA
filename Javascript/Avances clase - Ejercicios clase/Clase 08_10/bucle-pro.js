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
function sequence1(functions, x) {
    let x1 = x;
    for(let funct of functions) {
        x1 = funct(x1)
    }

    return x1;
}

function sequence2(functions, x) {
    let x1 = x;
    for(let funct of functions) {
        x1 = funct(x1)
        if (x1 == undefined) return undefined;
    }

    return x1;
}

function sequence3(functions, x, inverseOrder){
    if(inverseOrder == undefined || !inverseOrder) {
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
console.log(sequence3([(x) => {return x * x}, (x) => {return x * 2}, (x) => {return x / 2}], 4, false));

//3
