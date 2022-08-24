"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../../models/order");
const user_1 = require("../../models/user");
const product_1 = require("../../models/product");
const store = new order_1.OrderStore();
const user_store = new user_1.UserStore();
const product_store = new product_1.ProductStore();
describe('- Order Model', () => {
    let user_id;
    let product_id;
    let order_id;
    let order_product_id;
    const order = {
        user_id: 0,
        status: 'active',
    };
    const order_product = {
        order_id: 0,
        product_id: 0,
        quantity: 5,
    };
    beforeAll(async () => {
        const user = {
            first_name: 'Mahmoud',
            last_name: 'Elbagoury',
            password: 'password',
        };
        const new_user = await user_store.create(user);
        user_id = new_user.id;
        order.user_id = user_id;
        const product = {
            name: 'watch',
            price: 20.0,
            category: 'hand watch',
        };
        const new_product = await product_store.create(product);
        product_id = new_product.id;
        order_product.product_id = product_id;
    });
    it('Should create an order', async () => {
        const newOrder = await store.create(order);
        expect(newOrder.user_id).toBe(user_id);
        expect(newOrder.status).toBe(order.status);
        order_id = newOrder.id;
        order_product.order_id = order_id;
    });
    it('Index should return at least 1 order (we just created 1)', async () => {
        const orders = await store.index();
        expect(orders[0]).toBeTruthy();
    });
    it('Show order', async () => {
        const order = await store.show(order_id);
        expect(order.id).toBe(order_id);
    });
    it('Get current active order from user', async () => {
        const order = await store.currentOrder(user_id);
        expect(order[0].status).toBe('active');
    });
    it('Update order status to completed', async () => {
        const updateOrder = {
            id: order_id,
            user_id: user_id,
            status: 'complete',
        };
        const newOrder = (await store.update(updateOrder));
        expect(newOrder.user_id).toBe(user_id);
        expect(newOrder.status).toBe('complete');
    });
    it('Return completed orders from user', async () => {
        const orders = await store.completedOrders(user_id);
        expect(orders[0].status).toBe('complete');
    });
    it('Add product to order', async () => {
        const newOrderProduct = await store.addProduct(order_product);
        expect(newOrderProduct.order_id).toBe(order_id);
        expect(newOrderProduct.product_id).toBe(product_id);
        expect(newOrderProduct.quantity).toBe(5);
        order_product_id = newOrderProduct.id;
    });
    it('Get order products by order id', async () => {
        const products = await store.getProducts(order_id);
        expect(products[0].order_id).toBe(order_id);
    });
    it('Update quantity of order product', async () => {
        const updateOrderProduct = {
            id: order_product_id,
            order_id: order_id,
            product_id: product_id,
            quantity: 10,
        };
        const OrderProduct = await store.updateProduct(updateOrderProduct);
        expect(OrderProduct.quantity).toBe(10);
    });
    it('Delete order product', async () => {
        const OrderProduct = await store.deleteProduct(order_product_id);
        expect(OrderProduct.id).toBe(order_product_id);
    });
    it('Delete order', async () => {
        const order = await store.delete(order_id);
        expect(order.id).toEqual(order_id);
    });
    afterAll(async () => {
        await user_store.delete(user_id);
        await product_store.delete(product_id);
    });
});
