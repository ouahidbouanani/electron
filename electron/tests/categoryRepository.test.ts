import { categoryRepository, Category } from '../repositories/categoryRepository';

describe('Category Repository CRUD', () => {
  let id: number;

  it('should add a category', async () => {
    id = await categoryRepository.add({ nom: 'Test Category' });
    expect(id).toBeGreaterThan(0);
  });

  it('should get all categories', async () => {
    const categories = await categoryRepository.getAll();
    expect(categories.length).toBeGreaterThan(0);
  });

  it('should update a category', async () => {
    await categoryRepository.update({ id, nom: 'Category Modifiée' });
    const categories = await categoryRepository.getAll();
    expect(categories.find(c => c.id === id)?.nom).toBe('Category Modifiée');
  });

  it('should delete a category', async () => {
    await categoryRepository.delete(id);
    const categories = await categoryRepository.getAll();
    expect(categories.find(c => c.id === id)).toBeUndefined();
  });
});
