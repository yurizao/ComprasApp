import { type SQLiteDatabase } from "expo-sqlite"



export async function initializeDatabase (database: SQLiteDatabase) {
await database.execAsync(`DROP TABLE IF EXISTS Produtos;`);
await database.execAsync (`
    CREATE TABLE IF NOT EXISTS Produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        valor DECIMAL NOT NULL
      );
`)
}