import { query } from "../db";

export interface Commande {
  id?: number;
  client_id: number;
  date: string;
  total: number;
}

export const orderRepository = {
  async add(order: Omit<Commande, "id">): Promise<number> {
    const sql = `
      INSERT INTO commande (client_id, date, total)
      VALUES (?, ?, ?)
    `;
    const params = [order.client_id, order.date, order.total];

    const result = await query<any>(sql, params);
    return (result as any).insertId;
  },

  async getAll(): Promise<Commande[]> {
    const sql = `SELECT * FROM commande`;
    return await query<Commande>(sql);
  },

  async getById(id: number): Promise<Commande | undefined> {
    const sql = `SELECT * FROM commande WHERE id = ?`;
    const rows = await query<Commande>(sql, [id]);
    return rows[0];
  },

  async update(order: Commande): Promise<void> {
    if (!order.id) throw new Error("id manquant");

    const sql = `
      UPDATE commande
      SET client_id = ?, date = ?, total = ?
      WHERE id = ?
    `;
    const params = [order.client_id, order.date, order.total, order.id];

    await query(sql, params);
  },

  async delete(id: number): Promise<void> {
    const sql = `DELETE FROM commande WHERE id = ?`;
    await query(sql, [id]);
  },
};
