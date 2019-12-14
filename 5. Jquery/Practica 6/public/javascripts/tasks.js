$(() => {
    let preview = $("#preview"); //Preview de la tarea
    let taskName = $("#taskName"); //Nombre de la tarea en el formulario
    let taskDesc = $("#taskDesc");
    let addedTags = [""]; //Tags ya introducidas. Para impedir que se introduzcan tags repetidas.

    //Va añadiendo el texto a la preview
    taskName.on("change", (event) => {
        let text = taskName.val().trim();
        let textDiv = preview.children("h2").children("div")
        textDiv.text(text);
    });

    $("#addTag").on("click", (event) => {
        let tagName = $("#tagName").val().trim();
        let textDiv = preview.children("h2")
        let tag = $(`<span>${tagName}</span>`);

        tag.addClass("tag"); //Añadimos estilo
        if (tagName && !addedTags.includes("@" + tagName.replace(/ /g, "_"))) {
            addedTags.push("@" + tagName.replace(/ /g, "_"));
            textDiv.append(tag);
        }

        $("#tagName").val(""); //Reinicia el input de las tags

        event.preventDefault();
    });

    //Cuando pulsas en el tag, desaparece.
    preview.children("h2").on("click", "span", (event) => {
        $(event.target).remove();
        addedTags.splice(addedTags.indexOf(("@" + $(event.target).text().replace(/ /g, "_"))), 1); //Lo eliminamos de las ya añadidas para que pueda volver a escribirse
    })

    $("#add-task-button").on("click", (event) => {
        let taskText = preview.children("h2").children("div").text();
        if (!taskText || taskText === "") {
            alert("¡La tarea no tiene nombre!");
            event.preventDefault();
        }
        else {
            taskDesc.val(`${taskText} ${addedTags.slice(1, addedTags.length).join(" ")}`);
        }
    })
})