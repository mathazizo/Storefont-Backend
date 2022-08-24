import { Product, ProductStore } from '../../models/product';

const store = new ProductStore();

describe('- Product Model', () => {
  let product_id: number;
  const product: Product = {
    name: 'apple phone',
    price: 400.4,
    category: 'phone',
  };

  it('Should create a product with correct info', async () => {
    const newProduct = await store.create(product);
    expect(newProduct.name).toBe(product.name);
    expect(newProduct.category).toBe(product.category);
    product_id = newProduct.id as number;
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
    const updateProduct: Product = {
      id: product_id,
      name: 'sumsung tv',
      price: 900.44,
      category: 'tv',
    };
    const newProduct = (await store.update(updateProduct)) as Product;
    expect(newProduct.name).toBe('sumsung tv');
    expect(newProduct.category).toBe('tv');
  });

  it('Delete product', async () => {
    const product = await store.delete(product_id);
    expect(product.id).toEqual(product_id);
  });
});
