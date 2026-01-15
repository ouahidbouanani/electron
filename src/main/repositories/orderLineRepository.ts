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
    // 1️⃣ Vérifier la quantité actuelle en stock
    const rows = await query<{ quantite: number }>(
      "SELECT quantite FROM produit WHERE id = ?",
      [line.product_id]
    );

    if (rows.length === 0) {
      throw new Error("Produit introuvable");
    }

    const quantiteActuelle = rows[0].quantite;

    if (quantiteActuelle < line.quantite) {
      throw new Error("Stock insuffisant pour ce produit");
    }

    // 2️⃣ Insérer la ligne de commande
    const insertSql = `
      INSERT INTO commande_ligne
      (commande_id, product_id, product_name, quantite, prix)
      VALUES (?, ?, ?, ?, ?)
    `;

    const insertParams = [
      line.commande_id,
      line.product_id,
      line.product_name ?? null,
      line.quantite,
      line.prix,
    ];

    const result = await query<any>(insertSql, insertParams);
    const lineId = (result as any).insertId;

    // 3️⃣ Décrémenter la quantité du produit
    const updateSql = `
      UPDATE produit
      SET quantite = quantite - ?
      WHERE id = ?
    `;
    await query(updateSql, [line.quantite, line.product_id]);

    return lineId;
  },

  async getByCommande(commandeId: number): Promise<CommandeLigne[]> {
    const sql = `
      SELECT * FROM commande_ligne
      WHERE commande_id = ?
    `;
    return await query<CommandeLigne>(sql, [commandeId]);
  },

  async delete(id: number): Promise<void> {
    // Optionnel: remettre la quantité si on supprime une ligne (si tu veux je te le fais)
    await query("DELETE FROM commande_ligne WHERE id = ?", [id]);
  },

  async deleteByCommande(commandeId: number): Promise<void> {
    await query("DELETE FROM commande_ligne WHERE commande_id = ?", [commandeId]);
  },
};
