"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const request = (0, supertest_1.default)(server_1.default);
describe('- Product Handler:', () => {
    let product_id;
    const product = {
        name: 'Muñeca Mimish',
        price: 25.0,
        category: 'Toy',
    };
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJtYXJpIiwiZmlyc3RfbmFtZSI6Ik1hcmllbGEiLCJsYXN0X25hbWUiOiJEZWwgQmFycmlvIiwiaWF0IjoxNjU4NjQ0NDg1fQ.IDW55pCtF9bNgzBPCkWahAXGm7XhedfJ--3NF7ckNlg';
    it('Create a product', async () => {
        const response = await request
            .post('/products')
            .set('Authorization', 'Bearer ' + token)
            .send(product);
        const newProduct = response.body;
        expect(response.status).toBe(201);
        expect(newProduct.name).toBe('Muñeca Mimish');
        expect(newProduct.price).toBe('25');
        expect(newProduct.category).toBe('Toy');
        product_id = newProduct.id;
    });
    it('Get all products', async () => {
        const response = await request.get('/products');
        const products = response.body;
        expect(response.status).toBe(200);
        expect(products[0]).toBeTruthy();
    });
    it('Show product by id', async () => {
        const product = await request.get(`/products/${product_id}`);
        expect(product.body.id).toBe(product_id);
    });
    it('Update product', async () => {
        const updateProduct = {
            id: product_id,
            name: 'apple watch',
            price: 200.5,
            category: 'watch',
        };
        const newProduct = await request
            .put(`/products/${product_id}`)
            .send(updateProduct);
        expect(newProduct.body.name).toBe('apple watch');
        expect(newProduct.body.price).toBe('200.5');
        expect(newProduct.body.category).toBe('watch');
    });
    it('Delete product with id 1', async () => {
        const product = await request.delete(`/products/${product_id}`);
        const select = await request.get(`/products/${product_id}`);
        expect(product.status).toBe(200);
        expect(product.body.id).toBe(product_id);
        expect(select.status).toBe(500);
    });
});
