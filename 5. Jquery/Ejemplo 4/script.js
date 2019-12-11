$(() => {
    $("body").on("keydown", (event) => {
        let tecla = event.which;
        $(".span").removeClass("active");
        $("#numTecla").text(tecla);

        if(event.ctrlKey) $("#ctrl").addClass("active");
        if(event.metaKey) $("#meta").addClass("active");
        if(event.altKey) $("#alt").addClass("active");
        if(event.shiftKey) $("#shift").addClass("active");

        event.preventDefault();

    })
})