import { query } from "../db";

export type FactureStatut = "EMISE" | "PAYEE" | "ANNULEE";

export interface Facture {
  id?: number;
  numero: string;
  commande_id: number;
  date: string; // ISO
  total: number;
  statut?: FactureStatut;
}

export const factureRepository = {
  async getAll(): Promise<Facture[]> {
    const sql = `SELECT id, numero, commande_id, date, total, statut FROM facture ORDER BY id DESC`;
    const rows = await query(sql, []);
    return rows as Facture[];
  },

  async getById(id: number): Promise<Facture | null> {
    const sql = `SELECT id, numero, commande_id, date, total, statut FROM facture WHERE id = ? LIMIT 1`;
    const rows = await query(sql, [id]);
    return (rows[0] as Facture) ?? null;
  },

  async add(payload: Omit<Facture, "id">): Promise<number> {
    const sql = `INSERT INTO facture (numero, commande_id, date, total, statut) VALUES (?, ?, ?, ?, ?)`;
    const statut = payload.statut ?? "EMISE";
    const r: any = await query(sql, [payload.numero, payload.commande_id, payload.date, payload.total, statut]);
    return r.insertId as number;
  },

  async update(payload: Facture): Promise<void> {
    const sql = `UPDATE facture SET numero = ?, commande_id = ?, date = ?, total = ?, statut = ? WHERE id = ?`;
    await query(sql, [
      payload.numero,
      payload.commande_id,
      payload.date,
      payload.total,
      payload.statut ?? "EMISE",
      payload.id,
    ]);
  },

  async remove(id: number): Promise<void> {
    await query(`DELETE FROM facture WHERE id = ?`, [id]);
  },

  async getByCommande(commandeId: number): Promise<Facture[]> {
    const rows = await query(
      `SELECT id, numero, commande_id, date, total, statut FROM facture WHERE commande_id = ? ORDER BY id DESC`,
      [commandeId]
    );
    return rows as Facture[];
  },
};
