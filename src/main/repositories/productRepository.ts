import { query } from "../db";

export interface Produit {
  id?: number;
  nom: string;
  category_id?: number | null;
  prix: number;
  quantite: number;
}

export const productRepository = {
  async add(produit: Omit<Produit, "id">): Promise<number> {
    const sql = `
      INSERT INTO produit (nom, category_id, prix, quantite)
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      produit.nom,
      produit.category_id ?? null,
      produit.prix,
      produit.quantite,
    ];

    const result = await query<any>(sql, params);
    return (result as any).insertId;
  },

  async getAll(): Promise<Produit[]> {
    const sql = `SELECT * FROM produit`;
    return await query<Produit>(sql);
  },

  async getById(id: number): Promise<Produit | undefined> {
    const sql = `SELECT * FROM produit WHERE id = ?`;
    const rows = await query<Produit>(sql, [id]);
    return rows[0];
  },

  async update(produit: Produit): Promise<void> {
    if (!produit.id) throw new Error("id manquant");

    const sql = `
      UPDATE produit
      SET nom = ?, category_id = ?, prix = ?, quantite = ?
      WHERE id = ?
    `;
    const params = [
      produit.nom,
      produit.category_id ?? null,
      produit.prix,
      produit.quantite,
      produit.id,
    ];

    await query(sql, params);
  },

  async delete(id: number): Promise<void> {
    const sql = `DELETE FROM produit WHERE id = ?`;
    await query(sql, [id]);
  },
  async getByCategory(categoryId: number): Promise<Produit[]> {
  const sql = `SELECT * FROM produit WHERE category_id = ?`;
  return await query<Produit>(sql, [categoryId]);
},

};
