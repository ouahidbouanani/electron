// electron/db.ts
import mysql from 'mysql2';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',           
  database: 'stocks',
  port: 3306,
  connectionLimit: 10,
});

// Helper promisifié pour utiliser async/await
export function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results as T[]);
    });
  });
}
