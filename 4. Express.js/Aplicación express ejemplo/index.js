const Express = require('express');
const path = require('path');

var usuarios = ["Javier Montoro", "Dolores Vega", "Beatriz Nito"];
const ipCensuradas = ['147.96.81.244', '145.2.34.23'];
const app = Express();
app.set('view engine', 'ejs');
app.set("views",path.join(__dirname, "views"));

app.use((request, response, next) => {
    console.log(`Petición recibida ${request.method}, en ${request.url} de ${request.ip}`);
    next();
});


app.use((request, respose, next) =>{
    if(ipCensuradas.indexOf(request.ip) >= 0) {
        respose.status(401);
        respose.end("No autorizado");
    }
    else {
        console.log("ip autorizada");
        next();
    }
});

app.use((request, response, next) => {
    request.esUCM = request.ip.startsWith("147.96.");
    next();
})

app.listen(3000, (err) => {
    if (err) console.log(err);
    else console.log("Escuchando en el puerto 3000!");
})

app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname, "public", "bienvenido.html"))
});

app.get("/index.html", function (request, response) {
    response.status(200);
    response.type("text/plain; enconding=utf-8");
    response.write("Hola!");
    if(request.esUCM) {
        response.write("Estás conectado desde la UCM");
    }
    response.end();
});

app.get("/users.html", function (request, response) {
    response.status(200);
    response.render("users", { users: usuarios });
});

app.get("/usuarios.html", function (request, response) {
    response.redirect("/users.html");
});
