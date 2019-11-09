"use sctrict";

//Ejercicio 1
function producto(x1, x2) {
  if (typeof x1 == "number" && typeof x2 == "number") return x1 * x2;
  if (typeof x1 == "number" && x2 instanceof Array) {
    let toReturn = [];
    for (number in x2) toReturn[number] = x2[number] * x1;
    return toReturn;
  }
  if (x1 instanceof Array && typeof x2 == "number") {
    let toReturn = [];
    for (number in x1) toReturn[number] = x1[number] * x2;
    return toReturn;
  }
  if (x1 instanceof Array && x2 instanceof Array) {
    if (x1.length == x2.length) {
      let prodEscalar = 0;
      for (let index in x1) prodEscalar += x1[index] * x2[index];
      return prodEscalar;
    } else throw new Error("Error: los vectores no miden lo mismo");
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
} catch (Err) {
  console.log(Err.message);
}

//Ejercicio 2
function checkArguments(f) {
  if (!(f instanceof Array)) throw new Error(`${f} is not an Array`);
  for (let funct of f) {
    if (typeof funct != "function")
      throw new Error(`${func} is not a function!`);
  }
}

function sequence1(functions, x) {
  checkArguments(functions);
  let x1 = x;
  for (let funct of functions) {
    x1 = funct(x1);
  }

  return x1;
}

function sequence2(functions, x) {
  checkArguments(functions);
  let x1 = x;
  for (let funct of functions) {
    x1 = funct(x1);
    if (x1 == undefined) return undefined;
  }

  return x1;
}

function sequence3(functions, x, inverseOrder = false) {
  checkArguments(functions);
  if (!inverseOrder) {
    return sequence2(functions, x);
  } else {
    return sequence2(functions.reverse(), x);
  }
}

let funct1 = function(x) {
  console.log("Ejecutando funcion 1");
  return x * x;
};

let funct2 = function(x) {
  console.log("Ejecutando funcion 2");
  return 3 * x;
};

let funct3 = function(x) {
  console.log("Ejecutando funcion 3");
  return x / 2;
};

console.log(sequence3([funct1, funct2, funct3], 3, true));
console.log(sequence3([x => x * x, x => x * 2, x => x / 2], 4, false));

//Ejercicio 4 (Sobrescribí el ejercicio 3)
function pluck(objects, fieldName) {
  if (!(objects instanceof Array))
    throw new Error(`${objects} must be an array of objects`);
  return objects.map(elem => elem[fieldName]).filter(elem => elem != undefined);
}

//Test
let personas = [
  { nombre: "Ricardo", edad: 63 },
  { nombre: "Paco", edad: 55 },
  { nombre: "Enrique", edad: 32 },
  { nombre: "Adrián", edad: 32 },
  { apellidos: "García", edad: 28 }
];

console.log("PLUCK with high order functions");
console.log(pluck(personas, "nombre"));
console.log(pluck(personas, "edad"));
console.log(pluck(personas, "email"));

function partition(list, condition) {
  //Condition es una funcion
  if (!(list instanceof Array)) throw new Error(`${list} is not a list!`);
  if (typeof condition != "function")
    throw new Error(`${condition} is not a function`);
  let trueElems = list.filter(elem => condition(elem)),
    falseElems = list.filter(elem => !condition(elem));
  return [trueElems, falseElems];
}

function partition2(list, condition) {
    return list.reduce((ac, n) => {
      if(condition(n)) ac[0].push(n);
      else ac[1].push(n);
      return ac;
    } , [[], []]);
  }
  
  console.log("Partition with high order functions");
  console.log(partition(personas, pers => pers.edad >= 60));
  console.log("partition2");
  console.log(partition2(personas, pers => pers.edad >= 60));

function groupBy(array, f) {
  let groupedSet = {};
  if (!(array instanceof Array)) throw new Error(`${array} is not a list!`);
  if (typeof f != "function") throw new Error(`${f} is not a function`);

  array.forEach(elem => {
    let result = f(elem);
    if (groupedSet[result] == undefined) {
      groupedSet[result] = [];
    }
    groupedSet[result].push(elem);
  });

  return groupedSet;
}

function groupBy2(arr, f) {
    return arr.reduce((ac, n) => {
        let result = f(n);
        if(ac[result] == undefined) ac[result] = [];
        ac[result].push(n);
        return ac;
    }, {})
}

console.log(
  groupBy(["Mario", "Elvira", "María", "Estela", "Fernando"], str => str[0])
);

console.log("GroupBy 2")
console.log(
    groupBy2(["Mario", "Elvira", "María", "Estela", "Fernando"], str => str[0])
);

function where(list, model) {
  let attributes = Object.keys(model);
  return list.filter(elem => {
    let each_element_attributte = Object.keys(elem);
    return attributes.every(
      prop =>
        each_element_attributte.includes(prop) && elem[prop] == model[prop]
    );
  });
}

console.log(where(personas, { edad: 32 }));
console.log(where(personas, { nombre: "Adrián" }));
console.log(where(personas, { edad: 32, nombre: "Adrián" }));
console.log(where(personas, { apellidos: "García" }));
console.log(where(personas, { apellidos: "Conde" }));
console.log(where(personas, { correo: "correo@correo.com" }));

// Ejercicios clase dia 15/10
function mapLengths(array) {
  return array.map(elem => elem.length);
}

console.log(mapLengths(["Manuel", "es", "calvo"]));

function filterInf(array) {
  return array.filter((elem, index, arr) => index < arr.length / 2);
}

console.log(filterInf([1, 2, 3, 4, 5, 6, 7, 8, 9]));

function everyFunction(array) {
  if (!(array instanceof Array)) return false;
  if (array.length == 0) return false;
  return array.every(elem => typeof elem == "function");
}

console.log(everyFunction([x => x + 1, x => x - 1]));
console.log(everyFunction(["Hola", x => x * 2]));
console.log(everyFunction([]));

function someUndefined(arr) {
  return arr.some(elem => typeof elem == "undefined");
}

console.log(someUndefined([undefined, "hola"]));
console.log(someUndefined(["hola", "no"]));

function reduceSquare(arr) {
  //suma de los cuadrados
  return arr.reduce((ac, n) => ac + n * n);
}

console.log(reduceSquare([2, 4, 6], 0)); //4 + 16 + 36 = 54
// ---------------------------------------------- \\

//Ejercicio 5
function concatenar() {
  //arguments: guarda los argumentos
  if(arguments.length < 2) return "";
  let delimiter = arguments[0];

  return Array.from(arguments).slice(1, arguments.length)
  .reduce((ac, elem) => ac + (elem + delimiter), "");
}

console.log(concatenar());
console.log(concatenar("-"));
console.log(concatenar("-","uno"));
console.log(concatenar("-", "uno", "dos", "tres"));
console.log(concatenar("-", "uno", "dos", "tres", "cuatro", "cinco"));

//Ejercicio 6
function mapFilter(array, f) {
  return array.reduce((ac, elem) => {
    let result;
    try {
      result = f(elem); //la funcion puede lanzar excepcion si en ella no se controla el tipo
    } catch (err) { result = undefined; }
    if (typeof result != 'undefined') ac.push(result);
    return ac;
  }, []);
}

console.log(mapFilter(["23", "44", "das", "555", "21"], 
  (str) => {
    let num = Number(str);
    if (!isNaN(num)) return num;
  })
);

console.log(mapFilter(["hola", {no: false}, "que", "tal"], str => str[0].toUpperCase()));

//Ejercicio 7
function interpretarColor(str) {
  let colors = ((str || "").match(/\w{2,2}/g) || []);
  if(colors.length < 3 || colors.length > 3) return {error: "Bad color format"};
  return {
    red: parseInt(colors[0], 16),
    green: parseInt(colors[1], 16),
    blue: parseInt(colors[2], 16)
  };
}

console.log(interpretarColor("#FA10FF"));
console.log(interpretarColor("#BABBFA"));
console.log(interpretarColor("#BA"));
console.log(interpretarColor("#BBAABBAABBAA"));
console.log(interpretarColor());
console.log(interpretarColor(""));

//Ejercicio 8
class Figura {
  constructor(x, y, color = '#000000') {
      this.x = x;
      this.y = y;
      this.color = Figura.inHexNotation(color);
  }

  static inHexNotation(number) {
      number = number.toUpperCase();
      let colors = number.match(/\w{2,2}/g);
      if(colors.length < 3 || colors.length > 3 
        || typeof number !== 'string') number = '#000000'

      return number;
  }

  esBlanca() {
      return this.color === '#FFFFFF';
  }

  pintar() {
      return `Nos movemos a la posicion (${this.x}, ${this.y})\nCogemos la pintura de color ${this.color}`;
  }
}

class Elipse extends Figura {
  constructor(x, y, rh, rv, color = '#000000') {
      super(x, y, color);
      this.rh = rh;
      this.rv = rv;
  }

  pintar() {
      return super.pintar() + `\nPintamos elipse de radios ${this.rh} y ${this.rv}`;
  }
}

class Circulo extends Elipse {
  constructor(x, y, r, color = '#000000') {
      super(x, y, r, r, color);
  }
}

let circulo = new Circulo(4, -2, 3, '#abcdab');
console.log(circulo.pintar());
console.log(circulo.esBlanca());


