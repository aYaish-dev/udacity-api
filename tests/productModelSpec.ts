import { ProductModel, Product } from '../src/models/product';

const productModel = new ProductModel();

describe('ProductModel (unit)', () => {
  const uniqueName = `Unit Product ${Date.now()}`;
  let createdProduct: Product;

  it('create() should persist and return the product', async () => {
    const result = await productModel.create({
      name: uniqueName,
      price: 42.5,
      category: 'unit-test'
    });

    expect(result.id).toBeDefined();
    expect(result.name).toBe(uniqueName);
    expect(result.price).toBe(42.5);
    expect(result.category).toBe('unit-test');
    createdProduct = result;
  });

  it('index() should include the created product', async () => {
    const products = await productModel.index();
    expect(Array.isArray(products)).toBeTrue();
    const found = products.find((p) => p.id === createdProduct.id);
    expect(found).toBeDefined();
    expect(found?.name).toBe(uniqueName);
  });

  it('show(id) should return the product by id', async () => {
    const product = await productModel.show(createdProduct.id as number);
    expect(product).toBeTruthy();
    expect(product?.id).toBe(createdProduct.id);
    expect(product?.name).toBe(uniqueName);
  });
});