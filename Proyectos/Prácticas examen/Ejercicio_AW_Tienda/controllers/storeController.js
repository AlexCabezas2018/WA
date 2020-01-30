// requires
const path = require('path');
const StoreModel = require('../models/storeModel');
const UsersModel = require('../models/usersModel');

const storeModel = new StoreModel();
const usersModel = new UsersModel();

function handleAllProducts(req, res, next) {
    const { currentUser } = req.session;
    storeModel.getAllProducts((err, products) => {
        if (err) next(err);
        else {
            storeModel.getAllProductsFromList(currentUser.id, (err, productsList) => {
                if (err) next(err);
                else res.status(200).render('products-page', { currentUser, products, productsList });
            })
        }
    })
}

function handleProductsByCategory(req, res, next) {
    storeModel.getProductsByCategory(req.params.category, (err, products) => {
        if (err) next(err);
        else res.status(200).json(products ? products : []);
    })
}

function handleOneProduct(req, res, next) {
    const { currentUser } = req.session;
    storeModel.getOneProduct(req.params.idProduct, (err, product) => {
        if (err) next(err);
        else {
            if (!product) next(new Error("¡No hemos encontrado el producto que pediste!"));
            else res.status(200).render('product', { currentUser, product });
        }
    })
}
function handleBuyProduct(req, res, next) {
    const { currentUser } = req.session;
    storeModel.getOneProduct(req.params.idProduct, (err, product) => {
        if (err) next(err);
        else {
            if (product.amount <= 0) {
                res.setFlash(`¡Nos hemos quedado sin ${product.name}!`);
                res.redirect('/store/products');
            }
            else if (currentUser.puntuation - product.price < 0) {
                res.setFlash(`¡No tienes puntos para comprar ${product.name}!`);
                res.status(200).redirect('/store/products');
            }
            else {
                storeModel.buyOneProduct(req.params.idProduct, currentUser.id, (err, success) => {
                    if (err) next(err);
                    const actualPuntuation = currentUser.puntuation - product.price;
                    usersModel.updateAndGetUser(currentUser.email, actualPuntuation, (err, user) => {
                        if (err) next(err);
                        else {
                            req.session.currentUser = user;
                            res.status(200).redirect('/store/products');
                        }
                    });
                });
            }
        }
    });
}

function handleProductImage(req, res, next) {
    storeModel.getProductImage(req.params.idProduct, (err, image) => {
        if (err) next(err);
        else {
            if (!image) res.status(200).sendFile(path.join(__dirname, "..", "public", "img", "product-img.png"));
            else res.end(image);
        }
    });
}

function handleCreateProduct(req, res) {
    const { currentUser } = req.session;
    res.status(200).render('create-product', { currentUser })
}

function handleCreateProductPost(req, res, next) {
    const product = {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        amount: req.body.amount,
        price: req.body.price,
        image: req.file ? req.file.buffer : null,
    }

    storeModel.createProduct(product, (err, success) => {
        if (err || !success) next(err);
        else res.status(200).redirect('/store/products');
    })

}

module.exports = {
    handleAllProducts,
    handleProductsByCategory,
    handleOneProduct,
    handleBuyProduct,
    handleProductImage,
    handleCreateProduct,
    handleCreateProductPost
};