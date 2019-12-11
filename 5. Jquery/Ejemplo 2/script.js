$(() => {
    let parrafo = $("div.parrafo")
    $("body").on("keydown", (event) => {
        let x = 0, y = 0;

        switch (event.which) {
            case 38: y = -1; break;
            case 40: y = 1; break;
            case 37: x = -1; break;
            case 39: x = 1; break;
        }
        let position = { x, y }
        let currentPosition = parrafo.offset();
        parrafo.offset({
            left: currentPosition.left + position.x,
            top: currentPosition.top + position.y
        });

        event.preventDefault();
    });
})