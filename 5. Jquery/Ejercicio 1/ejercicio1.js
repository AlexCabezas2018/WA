// Ejercicio 1
let m = [
    ["Esto", "es", "una fila"],
    ["aquí", "va", "otra fila"],
    ["y", "aquí", "otra más"]
];


function insertaMatrix(selector, matriz) {
    //tr = fila
    //td = columna
    let tabla = $("<table></table>");

    matriz.forEach(fila => {
        let row = $("<tr></tr>");
        fila.forEach(celda => {
            row.append(`<td>${celda}</td>`);
        })
        tabla.append(row);
    });

    selector.append(tabla);
}

$(() => {
    let selector = $("div.tabla");
    insertaMatrix(selector, m);
})
