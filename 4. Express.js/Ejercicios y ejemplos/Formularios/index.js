const Express = require('express');
const path = require('path');

const app = Express();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(Express.static(path.join(__dirname, "public")));

app.get("/procesar_get", function (request, response) { 
    let sexoStr = "No especificado";
    switch (request.query.sexo) {
        case"H": sexoStr = "Hombre"; break;
        case"M": sexoStr = "Mujer"; break;    
    }
    response.render("infoForm", { 
        nombre: request.query.nombre,
        edad: request.query.edad,
        sexo: sexoStr,
        fumador: (request.query.fumador === "ON" ? "Sí" : "No")
    });
});

app.listen(3000, (err) => console.log("Corriendo en el puerto 3000"))
