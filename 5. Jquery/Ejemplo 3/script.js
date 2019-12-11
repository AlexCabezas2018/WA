$(() => {
    let posicionRaton = $("div.position");
    $("div.surface").on("mousemove", (event) => {
        posicionRaton.text(`${event.pageX} x ${event.pageY}`);

        event.preventDefault();
    });

    $("div.surface").on("mouseenter", () => posicionRaton.show());
    $("div.surface").on("mouseleave", () => posicionRaton.hide());

})