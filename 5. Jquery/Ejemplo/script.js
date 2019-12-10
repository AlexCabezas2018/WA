var str = "Mi cadena";
let y = "ejemplo";
console.log(window.str);        // → Mi cadenaconsole.log(window.str); // → Mi cadena
console.log(window.y);

// let timeoutID = setTimeout(() => {
//     console.log("¡Hola!");
// }, 1000);// Imprime "¡Hola!" tras un segundo


// let intervalID = setInterval(() => {
//     console.log("GRande!");
// }, 1000);// Imprime "¡Hola!" tras un segundo 1000 veces

// //paramos temporizador tras 5 seg
// setTimeout(() => {
//     clearInterval(intervalID);
// }, 5000)

//tam pantalla
console.log(screen.availWidth);  // → 1050
console.log(screen.availHeight);  // → 1920


$(() => {
    let bodyElems= $("body").children();
    bodyElems.css("background-color", "#FFFFD0");


    let candadoAbierto = true;

    function cambiarCandado() {
            candadoAbierto = !candadoAbierto;
            if (candadoAbierto) {
                $("#candado").prop("src", "candadoAbierto.png");
            } 
            else {
                $("#candado").prop("src", "candadoCerrado.png");
            }
    } 

    $(function() {    
                $("#botonAbrirCerrar").on("click", cambiarCandado);
    });

    function abrirVentana() {
            $("#ventana").show();
    }
    function cerrarVentana() {
           $("#ventana").hide();
    }
    
    $(function() {    $("#mostrarVentana").on("click", abrirVentana);    $("#ventana span.cerrar").on("click", cerrarVentana);    $("#cerrar").on("click", cerrarVentana);});

})
