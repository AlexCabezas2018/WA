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
    let bodyElems = $("body").children();
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

    $(function () {
        $("#botonAbrirCerrar").on("click", cambiarCandado);
    });

    function abrirVentana() {
        $("#ventana").show();
    }
    function cerrarVentana() {
        $("#ventana").hide();
    }

    $(function () { $("#mostrarVentana").on("click", abrirVentana); $("#ventana span.cerrar").on("click", cerrarVentana); $("#cerrar").on("click", cerrarVentana); });


    $("#campoNumero").on("change", function () {// Obtenemos valor actual 
        let valor = $(event.target).prop("value").trim();
        if (valor === "") {
            $("#mensaje").text("El campo está vacío");
        }
        else if (isNaN(Number(valor))) {
            $("#mensaje").text("No se ha introducido un número");
        }
        else {
            $("#mensaje").text("");
        }
    });

    var n = $("#elem").data("number");
    // Al pulsar el botón Incrementar, se incrementan la propiedad
    // 'number' del párrafo.
    $("#incrementar").on("click", function () {
        let elemento = $("#elem");
        let num = elemento.data("number");
        elemento.data("number", num + 1);
    });
    // Al pulsar el botón Obtener, se muestra el valor actual de la
    // propiedad 'number' del párrafo
    $("#obtener").on("click", function () {
        alert($("#elem").data("number"));
    });

    /******************CREACION DE NODOS********************/
    //$("<img>").prop("src", imagen).addClass("imagen-ciudad");

    $(function () {
        $("#añadirElemento").on("click", function () {
            let nuevoElemento = $("<li>Nuevo elemento</li>");
            $("#listaNumerada").append(nuevoElemento);
        });
    });

    /************POSICIONAMIENTO Y DIMENSIONES**********/
    function actualizarEtiqueta(elem) {
        let ancho = Math.round(elem.width());
        let alto = Math.round(elem.height());
        $("div.tamaño").text(`${ancho} x ${alto}`);
    }
    
    $(function () {
        let parrafo = $("div.parrafo");
        actualizarEtiqueta(parrafo); // Cuando se pulsa el botón de aumentar anchura...    
        $("#aumentarAnchura").on("click", function () {
            // Obtenemos la anchura actual y establecemos la nueva
            let anchoActual = parrafo.width();
            parrafo.width(anchoActual + 20);// Actualizamos la etiqueta con la nueva dimensión        
            actualizarEtiqueta(parrafo);
        });
    });





})
