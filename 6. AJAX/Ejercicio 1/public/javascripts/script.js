$(() => {
    actualizarLista();
    $("#sendButton").on("click", (event) => {
        $.ajax({
            method: "POST",
            url: "/newRecord",
            contentType: "application/json",
            data: JSON.stringify({ name: $('#nombrePlayer').val() }),
            success: function () {
                actualizarLista();
            },
            // En caso de error, mostrar el error producido
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Se ha producido un error: " + errorThrown);
            }
        })

        event.preventDefault();
    })
});

function actualizarLista() {
    let tabla = $("#table");

    $.ajax({
        method: "GET",
        url: "/highestRecords",
        success: function (data, textStatus, jqXHR) {
            tabla.empty();
            let encabezado = $("<tr><th><strong>Nombre</strong></th><th><strong>Puntuación</strong></th></tr>");
            tabla.append(encabezado);
            data.forEach(player => {
                let row = $(`<tr><td><strong>${player.nombre}</strong></td><td><strong>${player.puntos}</strong></td></tr>`)
                tabla.append(row);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    })


}