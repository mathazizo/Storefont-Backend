"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
const database_1 = __importDefault(require("../database"));
class ProductStore {
    async create(product) {
        try {
            const conn = await database_1.default.connect();
            const sql = `INSERT INTO products (name, price, category) 
        VALUES ($1, $2, $3) 
        RETURNING *;`;
            const { name, price, category } = product;
            const result = await database_1.default.query(sql, [name, price, category]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not create product: ${err}`);
        }
    }
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM products';
            const result = await database_1.default.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products: ${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM products WHERE id = $1;';
            const result = await database_1.default.query(sql, [id]);
            conn.release();
            if (result.rows.length === 0) {
                throw new Error(`Product with id ${id} does not exist`);
            }
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not get product: ${err}`);
        }
    }
    async update(product) {
        try {
            const conn = await database_1.default.connect();
            const sql = `UPDATE products 
      SET name = $1, price = $2, category = $3 
      WHERE id = $4 
      RETURNING *;`;
            const { name, price, category, id } = product;
            const result = await database_1.default.query(sql, [name, price, category, id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not update product: ${err}`);
        }
    }
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = `DELETE FROM products WHERE id = $1 RETURNING *;`;
            const result = await database_1.default.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not delete product: ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
