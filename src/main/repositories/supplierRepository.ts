import { query } from "../db";

export interface Fournisseur {
  id?: number;
  nom: string;
  contact?: string | null;
  telephone?: string | null;
  email?: string | null;
}

export const supplierRepository = {
  async add(f: Omit<Fournisseur, "id">): Promise<number> {
    const sql = `
      INSERT INTO fournisseur (nom, contact, telephone, email)
      VALUES (?, ?, ?, ?)
    `;
    const result = await query<any>(sql, [
      f.nom,
      f.contact ?? null,
      f.telephone ?? null,
      f.email ?? null,
    ]);

    return (result as any).insertId;
  },

  async getAll(): Promise<Fournisseur[]> {
    return await query<Fournisseur>(`SELECT * FROM fournisseur`);
  },
  
  async getById(id: number): Promise<Fournisseur | undefined> {
    const rows = await query<Fournisseur>(`SELECT * FROM fournisseur WHERE id = ?`, [id]);
    return rows[0];
  },
   async update(f: Fournisseur): Promise<void> {
    if (!f.id) throw new Error("L'ID du fournisseur est requis pour la mise à jour");
    const sql = `
      UPDATE fournisseur
      SET nom = ?, contact = ?, telephone = ?, email = ?
      WHERE id = ?
    `;
    const params = [
      f.nom,
      f.contact ?? null,
      f.telephone ?? null,
      f.email ?? null,
      f.id,
    ];
    await query(sql, params);
  },

  async delete(id: number): Promise<void> {
    await query(`DELETE FROM fournisseur WHERE id = ?`, [id]);
  }
};
