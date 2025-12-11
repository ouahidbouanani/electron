import { query } from "../db";

export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  telephone?: string | null;
  email?: string | null;
}

export const clientRepository = {
  async add(client: Omit<Client, "id">): Promise<number> {
    const sql = `
      INSERT INTO client (nom, prenom, telephone, email)
      VALUES (?, ?, ?, ?)
    `;

    const params = [
      client.nom,
      client.prenom,
      client.telephone ?? null,
      client.email ?? null,
    ];

    const result = await query<any>(sql, params);
    return (result as any).insertId;
  },

  async getAll(): Promise<Client[]> {
    const sql = `SELECT * FROM client`;
    return await query<Client>(sql);
  },

  async getById(id: number): Promise<Client | undefined> {
    const sql = `SELECT * FROM client WHERE id = ?`;
    const rows = await query<Client>(sql, [id]);
    return rows[0];
  },

  async update(client: Client): Promise<void> {
    if (!client.id) throw new Error("id manquant");

    const sql = `
      UPDATE client
      SET nom = ?, prenom = ?, telephone = ?, email = ?
      WHERE id = ?
    `;

    const params = [
      client.nom,
      client.prenom,
      client.telephone ?? null,
      client.email ?? null,
      client.id,
    ];

    await query(sql, params);
  },

  async delete(id: number): Promise<void> {
    const sql = `DELETE FROM client WHERE id = ?`;
    await query(sql, [id]);
  },
};
