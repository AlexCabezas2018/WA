$(() => {
    let preview = $("#preview"); //Preview de la tarea
    let taskName = $("#taskName"); //Nombre de la tarea
    let taskDesc = $("#taskDesc");
    let addedTags = []; //Tags ya introducidas. Para impedir que se introduzcan tags repetidas.

    //Va añadiendo el texto a la preview
    taskName.on("change", (event) => {
        let text = taskName.val().trim();
        let taskInfo = preview.children('.task_info');
        let textContainer = taskInfo.children("h2");
        textContainer.text(text);
    });

    $("#addTag").on("click", (event) => {
        let tagName = $("#tagName").val().trim();
        let taskInfo = preview.children('.task_info');
        let tag = $(`<span>${tagName}</span>`);

        tag.addClass("tag"); //Añadimos estilo
        taskInfo.append(tag);

        event.preventDefault();
    });

    //TODO Validaciones
    //TODO Manejar lo de la base de datos
    //TODO Cuando pulsas en le tag, desaparece.


})