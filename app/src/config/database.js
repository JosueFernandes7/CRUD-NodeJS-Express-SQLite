import Database from "better-sqlite3"

const db = new Database("dados.db", {
  // verbose: console.log,
})

// Table creation
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cpf TEXT UNIQUE,
      name TEXT,
      profile TEXT CHECK(profile IN ('ADMIN', 'CLIENTE')) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS phones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      number TEXT,
      is_primary BOOLEAN,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    
    CREATE TABLE IF NOT EXISTS emails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      email TEXT,
      is_primary BOOLEAN,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `)

export { db }
