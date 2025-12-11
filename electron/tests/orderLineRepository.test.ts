import { orderLineRepository, CommandeLigne } from '../repositories/orderLineRepository';
import { orderRepository } from '../repositories/orderRepository';
import { clientRepository } from '../repositories/clientRepository';
import { productRepository } from '../repositories/productRepository';

describe('OrderLine Repository CRUD', () => {
  let clientId: number;
  let orderId: number;
  let productId: number;
  let lineId: number;

  beforeAll(async () => {
    clientId = await clientRepository.add({ nom: 'Test', prenom: 'Client', email: null, telephone: null });
    orderId = await orderRepository.add({ client_id: clientId, date: new Date().toISOString(), total: 0 });
    productId = await productRepository.add({ nom: 'Produit Test', prix: 10, quantite: 5, category_id: null });
  });

  it('should add an order line', async () => {
    lineId = await orderLineRepository.add({
      commande_id: orderId,
      product_id: productId,
      quantite: 2,
      prix: 10
    });
    expect(lineId).toBeGreaterThan(0);
  });

  it('should get lines by order', async () => {
    const lines = await orderLineRepository.getByCommande(orderId);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('should delete a line', async () => {
    await orderLineRepository.delete(lineId);
    const lines = await orderLineRepository.getByCommande(orderId);
    expect(lines.find(l => l.id === lineId)).toBeUndefined();
  });

  afterAll(async () => {
    await orderRepository.delete(orderId);
    await clientRepository.delete(clientId);
    await productRepository.delete(productId);
  });
});
