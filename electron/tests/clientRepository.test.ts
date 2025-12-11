import { clientRepository, Client } from '../repositories/clientRepository';

describe('Client Repository CRUD', () => {
  let id: number;

  it('should add a client', async () => {
    id = await clientRepository.add({
      nom: 'Doe',
      prenom: 'John',
      email: 'john@example.com',
      telephone: '0123456789'
    });
    expect(id).toBeGreaterThan(0);
  });

  it('should get all clients', async () => {
    const clients = await clientRepository.getAll();
    expect(clients.length).toBeGreaterThan(0);
  });

  it('should get client by id', async () => {
    const client = await clientRepository.getById(id);
    expect(client?.nom).toBe('Doe');
  });

  it('should update a client', async () => {
    await clientRepository.update({
      id,
      nom: 'Smith',
      prenom: 'Jane',
      email: 'jane@example.com',
      telephone: null
    });
    const client = await clientRepository.getById(id);
    expect(client?.nom).toBe('Smith');
  });

  it('should delete a client', async () => {
    await clientRepository.delete(id);
    const client = await clientRepository.getById(id);
    expect(client).toBeUndefined();
  });
});
