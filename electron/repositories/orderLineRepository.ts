import { query } from "../db";

export interface CommandeLigne {
  id?: number;
  commande_id: number;
  product_id: number;
  product_name?: string;
  quantite: number;
  prix: number;
}

export const orderLineRepository = {
  async add(line: Omit<CommandeLigne, "id">): Promise<number> {
    const sql = `
      INSERT INTO commande_ligne (commande_id, product_id, product_name, quantite, prix)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      line.commande_id,
      line.product_id,
      line.product_name,
      line.quantite,
      line.prix,
    ];

    const result = await query<any>(sql, params);
    return (result as any).insertId;
  },

  async getByCommande(commandeId: number): Promise<CommandeLigne[]> {
    const sql = `
      SELECT * FROM commande_ligne
      WHERE commande_id = ?
    `;
    const rows = await query<CommandeLigne>(sql, [commandeId]);
    return rows;
  },

  async delete(id: number): Promise<void> {
    const sql = `DELETE FROM commande_ligne WHERE id = ?`;
    await query(sql, [id]);
  },

  async deleteByCommande(commandeId: number): Promise<void> {
    const sql = `DELETE FROM commande_ligne WHERE commande_id = ?`;
    await query(sql, [commandeId]);
  },
};
