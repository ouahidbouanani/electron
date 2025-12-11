import { query } from "../db";

export interface Category {
  id?: number;
  nom: string;
}

export const categoryRepository = {
  async add(category: Omit<Category, "id">): Promise<number> {
    const sql = `INSERT INTO category (nom) VALUES (?)`;
    const params = [category.nom];

    const result = await query<any>(sql, params);
    return (result as any).insertId;
  },

  async getAll(): Promise<Category[]> {
    const sql = `SELECT * FROM category`;
    return await query<Category>(sql);
  },

  async update(category: Category): Promise<void> {
    if (!category.id) throw new Error("id manquant");

    const sql = `UPDATE category SET nom = ? WHERE id = ?`;
    const params = [category.nom, category.id];

    await query(sql, params);
  },

  async delete(id: number): Promise<void> {
    const sql = `DELETE FROM category WHERE id = ?`;
    await query(sql, [id]);
  },
};
