import { supplierRepository } from "../repositories/supplierRepository";
import { query } from "../db";

jest.mock("../db", () => ({
  query: jest.fn(),
}));

describe("fournisseurRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("add() doit insérer un fournisseur et retourner insertId", async () => {
    (query as jest.Mock).mockResolvedValue({ insertId: 42 });

    const id = await supplierRepository.add({
      nom: "Test Fournisseur",
      telephone: "0606060606",
      email: "test@fournisseur.com",
    });

    expect(query).toHaveBeenCalledTimes(1);
    expect(id).toBe(42);
  });

  test("getAll() doit retourner la liste des fournisseurs", async () => {
    const mockData = [
      { id: 1, nom: "F1", telephone: "123", email: "f1@test.com" },
      { id: 2, nom: "F2", telephone: "456", email: "f2@test.com" },
    ];

    (query as jest.Mock).mockResolvedValue(mockData);

    const res = await supplierRepository.getAll();

    expect(query).toHaveBeenCalledTimes(1);
    expect(res).toEqual(mockData);
  });

  test("getById() doit retourner un fournisseur unique", async () => {
    const mockData = [
      { id: 1, nom: "Test", telephone: "123", email: "t@test.com" },
    ];

    (query as jest.Mock).mockResolvedValue(mockData);

    const res = await supplierRepository.getById(1);

    expect(query).toHaveBeenCalledWith(
      "SELECT * FROM fournisseur WHERE id = ?",
      [1]
    );
    expect(res).toEqual(mockData[0]);
  });

  test("update() doit exécuter la requête UPDATE", async () => {
    (query as jest.Mock).mockResolvedValue([]);

    await supplierRepository.update({
      id: 1,
      nom: "New Name",
      telephone: "999",
      email: "new@test.com",
    });

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE fournisseur"),
      ["New Name", null, "999", "new@test.com", 1]
    );
  });

  test("delete() doit supprimer un fournisseur", async () => {
    (query as jest.Mock).mockResolvedValue([]);

    await supplierRepository.delete(1);

    expect(query).toHaveBeenCalledWith(
      "DELETE FROM fournisseur WHERE id = ?",
      [1]
    );
  });
});
