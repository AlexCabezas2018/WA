const cookieParser = require("cookie-parser");
const Express = require('express');
const path = require('path');

const app = Express();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(Express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(Express.urlencoded({extended: false}));

app.post("/primerSumando", function (request, response) {
    response.status(200);
    response.cookie("first", request.body.primer_sumando);
    response.redirect("segundo.html");
});

app.post("/segundoSumando", function (request, response) {
    response.status(200);
    response.cookie("second", request.body.segundo_sumando);
    response.redirect('result');
});

app.get('/result', (request, response) => {
    let first = request.cookies.first;
    let second = request.cookies.second;
    let result = Number(request.cookies.first) + Number(request.cookies.second);
    response.clearCookie("first");
    response.clearCookie("second");
    response.render('resultado', {first, second, result});
})

app.listen(3000);