"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../../models/product");
const store = new product_1.ProductStore();
describe('- Product Model', () => {
    let product_id;
    const product = {
        name: 'apple phone',
        price: 400.4,
        category: 'phone',
    };
    it('Should create a product with correct info', async () => {
        const newProduct = await store.create(product);
        expect(newProduct.name).toBe(product.name);
        expect(newProduct.category).toBe(product.category);
        product_id = newProduct.id;
    });
    it('Index should return at least 1 product (we just created 1)', async () => {
        const products = await store.index();
        expect(products[0]).toBeTruthy();
    });
    it('Show product', async () => {
        const product = await store.show(product_id);
        expect(product.id).toBe(product_id);
    });
    it('Update product', async () => {
        const updateProduct = {
            id: product_id,
            name: 'sumsung tv',
            price: 900.44,
            category: 'tv',
        };
        const newProduct = (await store.update(updateProduct));
        expect(newProduct.name).toBe('sumsung tv');
        expect(newProduct.category).toBe('tv');
    });
    it('Delete product', async () => {
        const product = await store.delete(product_id);
        expect(product.id).toEqual(product_id);
    });
});
