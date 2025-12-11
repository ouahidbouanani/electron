import { productRepository } from '../repositories/productRepository';

describe('Product Repository', () => {
  let id: number;

  it('add', async () => {
    id = await productRepository.add({ nom: 'Test', prix: 10, quantite: 5, category_id: null });
    expect(id).toBeGreaterThan(0);
  });

  it('getById', async () => {
    const p = await productRepository.getById(id);
    expect(p?.nom).toBe('Test');
  });

  it('update', async () => {
    await productRepository.update({ id, nom: 'Modifié', prix: 12, quantite: 6, category_id: null });
    const p = await productRepository.getById(id);
    expect(p?.nom).toBe('Modifié');
  });

  it('delete', async () => {
    await productRepository.delete(id);
    const p = await productRepository.getById(id);
    expect(p).toBeUndefined();
  });
});
