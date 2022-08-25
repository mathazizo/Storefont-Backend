"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const user_1 = require("./user");
const store = new product_1.ProductStore();
const create = async (req, res) => {
    try {
        const product = req.body;
        const newProduct = await store.create(product);
        if (newProduct) {
            res.status(201).json(newProduct);
        }
        else {
            res.status(400).json({ error: 'Product was not created' });
        }
    }
    catch (err) {
        res.status(400).json({ error: `Product was not created: ${err}` });
    }
};
const index = async (req, res) => {
    try {
        const products = await store.index();
        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json({ error: `Could not get products: ${err}` });
    }
};
const show = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await store.show(id);
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json({ error: `Could not get product: ${err}` });
    }
};
const update = async (req, res) => {
    try {
        const product = req.body;
        const updatedProduct = await store.update(product);
        res.status(200).json(updatedProduct);
    }
    catch (err) {
        res.status(500).json({ error: `Could not update product: ${err}` });
    }
};
const del = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedProduct = await store.delete(id);
        res.status(200).json(deletedProduct);
    }
    catch (err) {
        res.status(500).json({ error: `Could not delete product: ${err}` });
    }
};
const productRoutes = (app) => {
    app.post('/products', user_1.verifyToken, create);
    app.get('/products', index);
    app.get('/products/:id', show);
    app.put('/products/:id', user_1.verifyToken, update);
    app.delete('/products/:id', user_1.verifyToken, del);
};
exports.default = productRoutes;
