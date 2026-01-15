import bcrypt from "bcryptjs";
import { query } from "../db";

export type AppUser = {
  id: number;
  nom: string;
  email: string;
  password_hash: string;
  created_at: string;
};

export const userRepository = {
  async findByEmail(email: string): Promise<AppUser | null> {
    const rows = await query<AppUser>("SELECT * FROM app_user WHERE email = ? LIMIT 1", [email]);
    return rows[0] ?? null;
  },

  async findById(id: number): Promise<Pick<AppUser, "id" | "nom" | "email" | "created_at"> | null> {
    const rows = await query<any>(
      "SELECT id, nom, email, created_at FROM app_user WHERE id = ? LIMIT 1",
      [id]
    );
    return rows[0] ?? null;
  },

  async createUser(payload: { nom: string; email: string; password: string }): Promise<number> {
    const existing = await this.findByEmail(payload.email);
    if (existing) throw new Error("Cet email est déjà utilisé.");

    const password_hash = await bcrypt.hash(payload.password, 10);
    const res: any = await query<any>(
      "INSERT INTO app_user (nom, email, password_hash) VALUES (?, ?, ?)",
      [payload.nom, payload.email, password_hash]
    );
    // mysql2 returns OkPacket with insertId
    return (res as any).insertId ?? (Array.isArray(res) ? (res as any)[0]?.insertId : undefined);
  },

  async verifyLogin(payload: { email: string; password: string }): Promise<Pick<AppUser, "id" | "nom" | "email" | "created_at">>{ 
    const user = await this.findByEmail(payload.email);
    if (!user) throw new Error("Email ou mot de passe incorrect.");

    const ok = await bcrypt.compare(payload.password, user.password_hash);
    if (!ok) throw new Error("Email ou mot de passe incorrect.");

    return { id: user.id, nom: user.nom, email: user.email, created_at: user.created_at };
  },
};
