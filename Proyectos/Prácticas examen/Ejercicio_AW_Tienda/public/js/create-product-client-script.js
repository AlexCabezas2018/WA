$(() => {
    let previewContainer = $(".item-preview");
    let fullPreviewContainer = $('.item-full-preview');
    let fullPreviewContainerInformation = $('<div></div>');

    $("#name").on('change', (event) => {
        const name = $('#name').val();
        previewContainer.children('h3#name').remove();
        fullPreviewContainer.children('div').remove();
        fullPreviewContainerInformation.children('h3#name').remove();
        previewContainer.append(`<h3 id='name'>${name}</h3>`);
        fullPreviewContainerInformation.append(`<h3 id='name'>Nombre: ${name}</h3>`);
        fullPreviewContainer.append(fullPreviewContainerInformation);
    });

    $("#categories-select").on('change', (event) => {
        const category = $('#categories-select option:selected').val();
        fullPreviewContainer.children('div').remove();
        fullPreviewContainerInformation.children('h3#cat').remove();
        fullPreviewContainerInformation.append(`<h3 id='cat'>Categoría: ${category}</h3>`);
        fullPreviewContainer.append(fullPreviewContainerInformation);
    });

    $('#desc').on('change', (event) => {
        const description = $('#desc').val();
        fullPreviewContainer.children('div').remove();
        fullPreviewContainerInformation.children('h3#desc').remove();
        fullPreviewContainerInformation.append(`<h3 id='desc'>Descripción: ${description}</h3>`);
        fullPreviewContainer.append(fullPreviewContainerInformation);
    });

    $('#quant').on('change', (event) => {
        const amount = $('#quant').val();
        const name = $('#name').val() ? $('#name').val() : `producto`;
        previewContainer.children('p#info').remove();
        const price = $('#price').val() ? $('#price').val() : 0;
        previewContainer.append(`<p id='info'>${price}pts / ${amount} uds</p>`);

        fullPreviewContainer.children('div').remove();
        fullPreviewContainerInformation.children('h3#info').empty();
        fullPreviewContainerInformation.append(`<h3 id='info'>Actualmente tenemos <b>${amount}</b> unidades de ${name} </h3>`);
        fullPreviewContainer.append(fullPreviewContainerInformation);
    });

    $('#price').on('change', (event) => {
        const price = $('#price').val();
        previewContainer.children('p#info').remove();
        const amount = $('#quant').val() ? $('#quant').val() : 0;
        previewContainer.append(`<p id='info'>${price}pts / ${amount} uds</p>`);

        fullPreviewContainer.children('div').remove();
        fullPreviewContainerInformation.children('h2#price').empty();
        fullPreviewContainerInformation.append(`<h2 id='price'>Precio: ${price} pto/unidad</h3>`);
        fullPreviewContainer.append(fullPreviewContainerInformation);
    });

    $('#file').change(function (event) {
        $(".prod-img").fadeIn("fast").attr('src', URL.createObjectURL(event.target.files[0]));
    });
});