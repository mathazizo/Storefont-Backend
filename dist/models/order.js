"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
const database_1 = __importDefault(require("../database"));
class OrderStore {
    async create(order) {
        try {
            const conn = await database_1.default.connect();
            const sql = `INSERT INTO orders (user_id, status)
        VALUES ($1, $2)
        RETURNING id, user_id, status`;
            const { user_id, status } = order;
            const result = await conn.query(sql, [user_id, status]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not create order: ${err}`);
        }
    }
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get orders: ${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM orders WHERE id = $1;';
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rows.length === 0) {
                throw new Error(`Could not find order with id: ${id}`);
            }
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not get order: ${err}`);
        }
    }
    async update(order) {
        try {
            const conn = await database_1.default.connect();
            const sql = `UPDATE orders 
      SET user_id = $1, status = $2 
      WHERE id = $3 
      RETURNING *;`;
            const { user_id, status, id } = order;
            const result = await conn.query(sql, [user_id, status, id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not update order: ${err}`);
        }
    }
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'DELETE FROM orders WHERE id = $1 RETURNING *;';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not delete order: ${err}`);
        }
    }
    async currentOrder(user_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = `SELECT * FROM orders WHERE user_id = $1 AND status = 'active';`;
            const result = await conn.query(sql, [user_id]);
            conn.release();
            if (result.rows.length === 0) {
                throw new Error(`Could not find active order for user: ${user_id}`);
            }
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get active orders by user id: ${err}`);
        }
    }
    async completedOrders(user_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = `SELECT * FROM orders WHERE user_id = $1 AND status = 'complete';`;
            const result = await conn.query(sql, [user_id]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get completed orders by user id: ${err}`);
        }
    }
    async addProduct(orderProduct) {
        try {
            const conn = await database_1.default.connect();
            const sql = `INSERT INTO order_products (order_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *;`;
            const { order_id, product_id, quantity } = orderProduct;
            const result = await conn.query(sql, [order_id, product_id, quantity]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not add product to order: ${err}`);
        }
    }
    async getProducts(order_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = `SELECT * FROM order_products WHERE order_id = $1;`;
            const result = await conn.query(sql, [order_id]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products from order: ${err}`);
        }
    }
    async updateProduct(orderProduct) {
        try {
            const conn = await database_1.default.connect();
            const sql = `UPDATE order_products 
      SET quantity = $1 
      WHERE id = $2 
      RETURNING *;`;
            const { quantity, id } = orderProduct;
            const result = await conn.query(sql, [quantity, id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not update product: ${err}`);
        }
    }
    async deleteProduct(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'DELETE FROM order_products WHERE id = $1 RETURNING *;';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not delete order product: ${err}`);
        }
    }
}
exports.OrderStore = OrderStore;
