const Express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const usuarios = ["Javier Montoro", "Dolores Vega", "Beatriz Nito"];

const app = Express();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(Express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (request, response) => {
    response.status(200).render("users", {users: usuarios});
});

// app.get("/eliminar/:index", (request, response) => {
//     usuarios.splice(request.params.index, 1);
//     response.status(200).redirect("/");
// });

app.post("/eliminar", (request, response) => {
    usuarios.splice(request.body.index, 1);
    response.status(200).redirect("/");
})

app.listen(3000, (err) => console.log("Escuchando al puerto 3000"));
