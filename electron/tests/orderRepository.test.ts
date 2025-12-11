import { orderRepository, Commande } from '../repositories/orderRepository';
import { clientRepository } from '../repositories/clientRepository';

describe('Order Repository CRUD', () => {
  let orderId: number;
  let clientId: number;

  beforeAll(async () => {
    // Crée un client pour la commande
    clientId = await clientRepository.add({
      nom: 'ClientOrder',
      prenom: 'Test',
      email: null,
      telephone: null
    });
  });

  it('should add an order', async () => {
    orderId = await orderRepository.add({
      client_id: clientId,
      date: new Date().toISOString(),
      total: 100
    });
    expect(orderId).toBeGreaterThan(0);
  });

  it('should get all orders', async () => {
    const orders = await orderRepository.getAll();
    expect(orders.length).toBeGreaterThan(0);
  });

  it('should get order by id', async () => {
    const order = await orderRepository.getById(orderId);
    expect(order?.client_id).toBe(clientId);
  });

  it('should update an order', async () => {
    await orderRepository.update({
      id: orderId,
      client_id: clientId,
      date: new Date().toISOString(),
      total: 200
    });
    const order = await orderRepository.getById(orderId);
expect(Number(order?.total)).toBe(200);

  });

  it('should delete an order', async () => {
    await orderRepository.delete(orderId);
    const order = await orderRepository.getById(orderId);
    expect(order).toBeUndefined();
  });

  afterAll(async () => {
    await clientRepository.delete(clientId);
  });
});
