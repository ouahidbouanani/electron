import { query } from "../db";

export interface Livraison {
  id?: number;
  commande_id: number;
  date_livraison?: string;
  statut?: 'EN_ATTENTE' | 'EXPEDIE' | 'LIVRE';
}

export const shipmentRepository = {
  async add(l: Omit<Livraison, "id">): Promise<number> {
    const sql = `INSERT INTO livraison (commande_id, date_livraison, statut) VALUES (?, ?, ?)`;
    const result = await query<any>(sql, [
      l.commande_id,
      l.date_livraison ?? new Date(),
      l.statut ?? 'EN_ATTENTE',
    ]);
    return (result as any).insertId;
  },

  async getByCommande(commande_id: number): Promise<Livraison[]> {
    const sql = `SELECT * FROM livraison WHERE commande_id = ?`;
    return await query<Livraison>(sql, [commande_id]);
  },

 async update(shipment: Livraison): Promise<void> {
    if (!shipment.id) throw new Error("id manquant");

    const sql = `
      UPDATE livraison
      SET date_livraison = ?, statut = ?
      WHERE id = ?
    `;
    const params = [
      shipment.date_livraison ?? null, // <- ici on met null si undefined
      shipment.statut ?? 'EN_ATTENTE',
      shipment.id,
    ];

    await query(sql, params);
  },

  async delete(id: number): Promise<void> {
    const sql = `DELETE FROM livraison WHERE id = ?`;
    await query(sql, [id]);
  },
   async getAll(): Promise<Livraison[]> {
    const sql = `SELECT * FROM livraison`;
    return await query<Livraison>(sql);
  },
  async getById(id: number): Promise<Livraison | null> {
  const rows = await query(
    "SELECT * FROM livraison WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

};
