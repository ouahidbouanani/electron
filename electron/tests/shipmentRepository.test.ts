// tests/shipmentRepository.test.ts
import { shipmentRepository } from "../repositories/shipmentRepository";
import { query } from "../db";

jest.mock("../db", () => ({
  query: jest.fn(),
}));

describe("shipmentRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("add() doit insérer une livraison et retourner l'id", async () => {
    (query as jest.Mock).mockResolvedValue({ insertId: 10 });

    const id = await shipmentRepository.add({ commande_id: 1, statut: "EN_ATTENTE" });

    expect(query).toHaveBeenCalledTimes(1);
    expect(id).toBe(10);
  });

  test("getAll() doit retourner toutes les livraisons", async () => {
    const mockData = [
      { id: 1, commande_id: 1, statut: "EN_ATTENTE" },
      { id: 2, commande_id: 2, statut: "EXPEDIE" },
    ];

    (query as jest.Mock).mockResolvedValue(mockData);

    const res = await shipmentRepository.getAll();

    expect(query).toHaveBeenCalledTimes(1);
    expect(res).toEqual(mockData);
  });

  test("getByCommande() doit retourner les livraisons d'une commande", async () => {
    const mockData = [{ id: 1, commande_id: 1, statut: "EN_ATTENTE" }];
    (query as jest.Mock).mockResolvedValue(mockData);

    const res = await shipmentRepository.getByCommande(1);

    expect(query).toHaveBeenCalledWith(
      "SELECT * FROM livraison WHERE commande_id = ?",
      [1]
    );
    expect(res).toEqual(mockData);
  });

  test("update() doit mettre à jour une livraison", async () => {
    (query as jest.Mock).mockResolvedValue([]);

   await shipmentRepository.update({ id: 1, commande_id: 1, statut: "LIVRE" });

expect(query).toHaveBeenCalledWith(
  expect.stringContaining("UPDATE livraison"),
  [null, "LIVRE", 1]  // <-- ici on accepte null pour date_livraison
);
  });

  test("delete() doit supprimer une livraison", async () => {
    (query as jest.Mock).mockResolvedValue([]);

    await shipmentRepository.delete(1);

    expect(query).toHaveBeenCalledWith(
      "DELETE FROM livraison WHERE id = ?",
      [1]
    );
  });
});
