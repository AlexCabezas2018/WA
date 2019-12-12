let miFormulario = [
    {
        label: "Nombre",
        name: "nombre"
    },
    {
        label: "Apellidos",
        name: "apellidos"
    },
    {
        label: "Edad",
        name: "edad"
    }
];

function embedForm(selector, formulario) {
    let form = $('<form method=POST action="procesarForm"></form>');
    formulario.forEach((formElem, i) => {
        form.append(`<label for="#input${i}">${formElem.label}</label>`);
        form.append(`<input type="text" name="${formElem.name}" id="#input${i}">`);
    });
    form.append("<input type='submit' value='Enviar'>");
    selector.append(form);
}

$(() => {
    embedForm($("body"), miFormulario);
})