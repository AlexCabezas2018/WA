"use strict"

/* NPM REQUIRES */
const express = require('express');
const path = require('path');
const middlewares = require('../middlewares');
const storeController = require('../controllers/storeController');
const multer = require('multer');
const multerFactory = multer({ storage: multer.memoryStorage() });

const storeRouter = express.Router();

storeRouter.use(express.urlencoded({ extended: false }));
storeRouter.use(express.static(path.join(__dirname, 'public')));

storeRouter.use(middlewares.popUpMessages);

storeRouter.get('/products', middlewares.checkLoginMiddleware, storeController.handleAllProducts);
storeRouter.get('/products/:category', middlewares.checkLoginMiddleware, storeController.handleProductsByCategory);
storeRouter.get('/product/:idProduct', middlewares.checkLoginMiddleware, storeController.handleOneProduct);
storeRouter.get('/product/photo/:idProduct', middlewares.checkLoginMiddleware, storeController.handleProductImage);
storeRouter.get('/create_product', middlewares.checkLoginMiddleware, storeController.handleCreateProduct);

storeRouter.post('/buy/:idProduct', middlewares.checkLoginMiddleware, storeController.handleBuyProduct);
storeRouter.post('/create_product', multerFactory.single('product-image'), middlewares.checkLoginMiddleware, storeController.handleCreateProductPost);

module.exports = storeRouter;


