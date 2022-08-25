"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret_token = process.env.SECRET_TOKEN;
const request = (0, supertest_1.default)(server_1.default);
describe('- Order Handler:', () => {
    let user_id;
    let product_id;
    let order_id;
    let order_product_id;
    let token;
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
        const new_user = await request.post('/users').send(user);
        token = new_user.body;
        const decoded = jsonwebtoken_1.default.verify(token, secret_token);
        user_id = decoded.id;
        order.user_id = user_id;
        const product = {
            name: 'Cradle to cradle',
            price: 8.0,
            category: 'Book',
        };
        const new_product = await request
            .post('/products')
            .set('Authorization', 'Bearer ' + token)
            .send(product);
        product_id = new_product.body.id;
        order_product.product_id = product_id;
    });
    it('Create an order', async () => {
        const response = await request
            .post('/orders')
            .set('Authorization', 'Bearer ' + token)
            .send(order);
        expect(response.status).toBe(201);
        expect(response.body.user_id).toEqual(order.user_id);
        expect(response.body.status).toEqual(order.status);
        order_id = response.body.id;
        order_product.order_id = order_id;
    });
    it('Get all orders', async () => {
        const response = await request
            .get('/orders')
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        const orders = response.body;
        expect(orders[0]).toBeTruthy();
    });
    it('Show order', async () => {
        const response = await request
            .get(`/orders/${order_id}`)
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        const order_1 = response.body;
        expect(order_1.id).toEqual(order_id);
    });
    it('Get current active order from user', async () => {
        const response = await request
            .get(`/orders/open/user/${user_id}`)
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        const orders = response.body;
        expect(orders[0].status).toBe('active');
    });
    it('Add product to order', async () => {
        const response = await request
            .post(`/orders/${order_id}/products`)
            .set('Authorization', 'Bearer ' + token)
            .send(order_product);
        expect(response.status).toBe(201);
        expect(response.body.order_id).toEqual(order_product.order_id);
        expect(response.body.product_id).toEqual(order_product.product_id);
        expect(response.body.quantity).toEqual(order_product.quantity);
        order_product_id = response.body.id;
    });
    it('Get all products of an order', async () => {
        const response = await request
            .get(`/orders/${order_id}/products`)
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        const order_products = response.body;
        expect(order_products[0]).toBeTruthy();
    });
    it('Update product of an order', async () => {
        const updated_order_product = {
            id: order_product_id,
            order_id: order_id,
            product_id: product_id,
            quantity: 10,
        };
        const response = await request
            .put(`/orders/${order_id}/products/${order_product_id}`)
            .set('Authorization', 'Bearer ' + token)
            .send(updated_order_product);
        expect(response.status).toBe(200);
        expect(response.body.quantity).toEqual(updated_order_product.quantity);
    });
    it('Update order status', async () => {
        const update_order = {
            id: order_id,
            user_id: user_id,
            status: 'complete',
        };
        const response = await request
            .put(`/orders/${update_order.id}`)
            .set('Authorization', 'Bearer ' + token)
            .send(update_order);
        expect(response.status).toBe(200);
        const order_1 = response.body;
        expect(order_1.status).toEqual(update_order.status);
    });
    it('Get complete orders from user', async () => {
        const response = await request
            .get(`/orders/completed/user/${user_id}`)
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        const orders = response.body;
        expect(orders[0].status).toBe('complete');
    });
    it('Delete product of an order', async () => {
        const response = await request
            .delete(`/orders/${order_id}/products/${order_product_id}`)
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(order_product_id);
    });
    it('Delete order', async () => {
        const response = await request
            .delete(`/orders/${order_id}`)
            .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(order_id);
    });
});
