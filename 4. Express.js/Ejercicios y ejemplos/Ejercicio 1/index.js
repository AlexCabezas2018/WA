const Express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const votations = {
    rojo: 0,
    azul: 0,
    verde: 0,
    ninguno: 0
}

const app = Express();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(Express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (request, response) => {
    response.redirect("encuesta.html")
});

app.post("/results", (request, response) => {
    votations[request.body.color]++;
    response.render("results", {votations});
})

app.listen(3000, (err) => console.log("Escuchando..."))

