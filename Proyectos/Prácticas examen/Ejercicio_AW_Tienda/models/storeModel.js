const mysql = require('mysql');
const config = require('../config');

class storeModel {
    constructor() {
        this.pool = mysql.createPool(config.mySQLConfig);
        this.exceptions = {
            connection_error: "[ERROR] Error de conexion a la base de datos",
            query_error: "[ERROR]Error de acceso a la base de datos",
            user_exists: "[ERROR] Ya existe una cuenta con este email"
        };
        this.queries = {
            GET_ALL_PRODUCTS: 'SELECT * FROM product',
            GET_PRODUCT_BY_ID: 'SELECT * FROM product WHERE id = ?',
            BUY_ONE_PRODUCT: 'UPDATE product SET amount = amount - 1 WHERE id = ?',
            GET_PRODUCT_PHOTO: 'SELECT image FROM product_images WHERE id_product = ?',
            FIND_BY_ID_ITEM_AND_ID_USER: 'SELECT COUNT(*) FROM product_list WHERE id_product = ? AND id_user = ?',
            INSERT_TO_PRODUCT_LIST: 'INSERT INTO product_list VALUES(?, ?, ?)',
            UPDATE_PRODUCT_LIST: 'UPDATE product_list SET units = units + 1 WHERE id_product = ? AND id_user = ?',
            GET_ALL_PRODUCTS_BY_ID_USER: 'SELECT id_product, units, name FROM product_list JOIN product ON (product.id = product_list.id_product) WHERE id_user = ?',
            GET_PRODUCTS_BY_CATEGORY: 'SELECT * FROM product WHERE category = ?',
            INSERT_PRODUCT: 'INSERT INTO product (category, name, description, amount, price) VALUES (?, ?, ?, ?, ?)',
            INSERT_PRODUCT_IMAGE: 'INSERT INTO product_images VALUES (?, ?)'
        }
    }

    getAllProducts(callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.GET_ALL_PRODUCTS, (err, products) => {
                    conn.release();
                    if (err) callback(new Error(this.exceptions.query_error), undefined);
                    else callback(null, products);
                })
            }
        });
    }

    getOneProduct(id, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.GET_PRODUCT_BY_ID, [id], (err, product) => {
                    conn.release();
                    if (err) callback(new Error(err.message), undefined);
                    else callback(null, product[0]);
                })
            }
        });
    }

    buyOneProduct(id_item, id_user, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.BUY_ONE_PRODUCT, [id_item], (err, result) => {
                    conn.release();
                    if (err) callback(new Error(err.message), false);
                    else {
                        this.addItemToProductList(id_item, id_user, callback);
                    }
                });
            }
        });
    }

    addItemToProductList(idItem, idUser, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.FIND_BY_ID_ITEM_AND_ID_USER, [idItem, idUser], (err, result) => {
                    if (err) callback(new Error(err.message), false);
                    else {
                        const exists = result[0]['COUNT(*)'] !== 0;
                        if (!exists) {
                            conn.query(this.queries.INSERT_TO_PRODUCT_LIST, [idUser, idItem, 1],
                                (err, result) => { conn.release(); callback(err ? new Error(err.message) : null, !err) });
                        }
                        else {
                            conn.query(this.queries.UPDATE_PRODUCT_LIST, [idItem, idUser],
                                (err, result) => { conn.release(); callback(err ? new Error(err.message) : null, !err) });
                        }
                    }
                });
            }
        });
    }

    getProductImage(id, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.GET_PRODUCT_PHOTO, [id], (err, productImage) => {
                    conn.release();
                    if (err) callback(new Error(err.message), undefined);
                    else callback(null, productImage.length === 0 ? undefined : productImage[0].image);
                })
            }
        });
    }

    getAllProductsFromList(idUser, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.GET_ALL_PRODUCTS_BY_ID_USER, [idUser], (err, products) => {
                    conn.release();
                    if (err) callback(new Error(err.message), undefined);
                    else callback(null, products.length === 0 ? undefined : products);
                })
            }
        });
    }

    getProductsByCategory(category, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(category == 'default' ? this.queries.GET_ALL_PRODUCTS : this.queries.GET_PRODUCTS_BY_CATEGORY, [category], (err, products) => {
                    conn.release();
                    if (err) callback(new Error(err.message), undefined);
                    else callback(null, products.length === 0 ? undefined : products);
                })
            }
        });
    }

    createProduct(product, callback) {
        this.pool.getConnection((err, conn) => {
            if (err) callback(new Error(this.exceptions.connection_error), undefined);
            else {
                conn.query(this.queries.INSERT_PRODUCT, [product.category, product.name, product.description, product.amount, product.price], (err, result) => {
                    if (err) callback(new Error(err.message), false);
                    else {
                        conn.query(this.queries.INSERT_PRODUCT_IMAGE, [result.insertId, product.image], (err, result) => callback(err ? new Error(err.message) : null, !err));
                    }
                });
            }
        });
    }
}

module.exports = storeModel;