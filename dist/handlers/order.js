"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const user_1 = require("./user");
const store = new order_1.OrderStore();
const create = async (req, res) => {
    try {
        const order = req.body;
        const newOrder = await store.create(order);
        if (newOrder) {
            res.status(201).json(newOrder);
        }
        else {
            res.status(400).json({ error: 'Could not create order' });
        }
    }
    catch (err) {
        res.status(500).json({ error: `Order was not created: ${err}` });
    }
};
const index = async (req, res) => {
    try {
        const orders = await store.index();
        if (orders) {
            res.status(200).json(orders);
        }
        else {
            res.status(400).json({ error: 'Could not get orders' });
        }
    }
    catch (err) {
        res.status(500).json({ error: `Could not get orders: ${err}` });
    }
};
const show = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await store.show(id);
        if (order) {
            res.status(200).json(order);
        }
        else {
            res.status(400).json({ error: 'Could not get order' });
        }
    }
    catch (err) {
        res.status(500).json({ error: `Could not get order: ${err}` });
    }
};
const update = async (req, res) => {
    try {
        const order = req.body;
        const updatedOrder = await store.update(order);
        if (updatedOrder) {
            res.status(200).json(updatedOrder);
        }
        else {
            res.status(400).json({ error: 'Could not update order' });
        }
    }
    catch (err) {
        res.status(500).json({ error: `Could not update order: ${err}` });
    }
};
const del = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedOrder = await store.delete(id);
        if (deletedOrder) {
            res.status(200).json(deletedOrder);
        }
        else {
            res.status(400).json({ error: 'Could not delete order' });
        }
    }
    catch (err) {
        res.status(500).json({ error: `Could not delete order: ${err}` });
    }
};
const currentOrder = async (req, res) => {
    try {
        if (req.params.id != res.locals.user.id) {
            res
                .status(401)
                .json({ error: 'You are not authorized to retrieve this order' });
        }
        const user_id = req.params.id;
        const orders = await store.currentOrder(user_id);
        if (orders) {
            res.status(200).json(orders);
        }
        else {
            res.status(400).json({ error: 'Could not get orders' });
        }
    }
    catch (err) {
        res.status(500).json({ error: `Could not get orders: ${err}` });
    }
};
const completedOrders = async (req, res) => {
    try {
        if (req.params.id != res.locals.user.id) {
            res
                .status(401)
                .json({ error: 'You are not authorized to retrieve completed orders' });
        }
        const user_id = req.params.id;
        const orders = await store.completedOrders(user_id);
        if (orders) {
            res.status(200).json(orders);
        }
        else {
            res.status(400).json({ error: 'Could not get orders' });
        }
    }
    catch (err) {
        res.status(500).json({ error: `Could not get orders: ${err}` });
    }
};
const addProduct = async (req, res) => {
    try {
        const orderProduct = req.body;
        const newOrderProduct = await store.addProduct(orderProduct);
        if (newOrderProduct) {
            res.status(201).json(newOrderProduct);
        }
        else {
            res.status(400).json({ error: 'Could not add product' });
        }
    }
    catch (err) {
        res.status(500).json({ error: `Could not add product: ${err}` });
    }
};
const getProducts = async (req, res) => {
    try {
        const id = req.params.id;
        const orderProducts = await store.getProducts(id);
        if (orderProducts) {
            res.status(200).json(orderProducts);
        }
        else {
            res.status(400).json({ error: 'Could not get order products' });
        }
    }
    catch (err) {
        res.status(500).json({ error: `Could not get order products: ${err}` });
    }
};
const updateProduct = async (req, res) => {
    try {
        const orderProduct = req.body;
        const updatedOrderProduct = await store.updateProduct(orderProduct);
        if (updatedOrderProduct) {
            res.status(200).json(updatedOrderProduct);
        }
        else {
            res.status(400).json({ error: 'Could not update order product' });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Could not update order product' });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.product_id;
        const deletedOrderProduct = await store.deleteProduct(id);
        if (deletedOrderProduct) {
            res.status(200).json(deletedOrderProduct);
        }
        else {
            res.status(400).json({ error: 'Could not delete order product' });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Could not delete order product' });
    }
};
const orderRoutes = (app) => {
    app.post('/orders', user_1.verifyToken, create);
    app.get('/orders', user_1.verifyToken, index);
    app.get('/orders/:id', user_1.verifyToken, show);
    app.put('/orders/:id', user_1.verifyToken, update);
    app.delete('/orders/:id', user_1.verifyToken, del);
    app.get('/orders/open/user/:id', user_1.verifyToken, currentOrder);
    app.get('/orders/completed/user/:id', user_1.verifyToken, completedOrders);
    app.post('/orders/:id/products', user_1.verifyToken, addProduct);
    app.get('/orders/:id/products', user_1.verifyToken, getProducts);
    app.put('/orders/:order_id/products/:product_id', user_1.verifyToken, updateProduct);
    app.delete('/orders/:order_id/products/:product_id', user_1.verifyToken, deleteProduct);
};
exports.default = orderRoutes;
