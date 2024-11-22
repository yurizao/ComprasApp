import { type SQLiteDatabase } from "expo-sqlite"

export async function initializeDatabase (database: SQLiteDatabase) {
await database.execAsync('PRAGMA foreign_keys = ON;');
await database.execAsync(`DROP TABLE IF EXISTS Produtos;`);

await database.execAsync(`
  CREATE TABLE IF NOT EXISTS compra (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data DATE NOT NULL,        
    descricao TEXT     
  );

`);
await database.execAsync (`
    CREATE TABLE IF NOT EXISTS Produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        compra_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        quantidade INTEGER NOT NULL DEFAULT 1,
        valor DECIMAL NOT NULL,
        FOREIGN KEY (compra_id) REFERENCES compra(id) ON DELETE CASCADE
      );
`)
}