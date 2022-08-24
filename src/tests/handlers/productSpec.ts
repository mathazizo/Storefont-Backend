import app from '../../server';
import { Product } from '../../models/product';
import supertest from 'supertest';

const request = supertest(app);

describe('- Product Handler:', () => {
  let product_id: number;
  const product: Product = {
    name: 'cat cup',
    price: 1.44,
    category: 'kids',
  };
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6Ik1haG1vdWQiLCJsYXN0X25hbWUiOiJFbGJhZ291cnkifQ.j0WEkKy08SZD9ZD6mDaLcYFSPpP4e93rZsfoOj26Hqk';

  it('Create a product', async () => {
    const response = await request
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send(product);
    const newProduct = response.body;
    expect(response.status).toBe(201);
    expect(newProduct.name).toBe('cat cup');
    expect(newProduct.price).toBe('1.44');
    expect(newProduct.category).toBe('kids');
    product_id = newProduct.id as number;
  });

  it('Get all products', async () => {
    const response = await request.get('/products');
    const products = response.body as Product[];
    expect(response.status).toBe(200);
    expect(products[0]).toBeTruthy();
  });

  it('Show product by id', async () => {
    const product = await request.get(`/products/${product_id}`);
    expect(product.body.id).toBe(product_id);
  });

  it('Update product', async () => {
    const updateProduct: Product = {
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
