"use strict"

$(() => {
    $('#categories-select').on('change', (event) => {
        const selectedValue = getSelectedValue().toLowerCase();
        $.ajax({
            url: `/store/products/${selectedValue}`,
            success: handleSuccess,
            error: function (jqXHR, textStatus, errorThrown) {
                alert(`Error: ${errorThrown}`)
            }
        })
    });

    function getSelectedValue() {
        return $('#categories-select option:selected').val();
    }

    function handleSuccess(data) {
        const productsContainer = $('.products-container');
        productsContainer.empty();
        if (data.length === 0) {
            productsContainer.append(`<h3> No hay productos de la categoría ${getSelectedValue()}`);
        }
        else {
            data.forEach(product => {
                const container = getProductContainerFromProductData(product);
                productsContainer.append(container);
            });
        }
    }

    function getProductContainerFromProductData(data) {
        let container = $('<div></div>');
        let image = $(`<a href="/store/product/${data.id}"></a>`);
        image.append(`<img src=/store/product/photo/${data.id}>`);
        let name = $(`<h3>${data.name}</h3>`);
        let price = $(`<p>${data.price}pts / ${data.amount} uds</p>`);
        let buyButton = $(`<form action="/store/buy/${data.id}" method="POST"><input type="submit" value="COMPRAR"></form>`);

        container.append(image);
        container.append(name);
        container.append(price);
        container.append(buyButton);

        container.addClass('product');

        return container;
    }
})
