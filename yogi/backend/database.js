import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import path from "path";

// ESM-safe __dirname — ensures DB is always created next to this file
// regardless of where the process was started from
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "mindcare.db");

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

// Users table
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Check-ins table
db.prepare(`
  CREATE TABLE IF NOT EXISTS checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    mood TEXT NOT NULL,
    stressLevel TEXT NOT NULL,
    hoursSlept REAL NOT NULL,
    studyHours REAL NOT NULL,
    notes TEXT DEFAULT '',
    date TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    UNIQUE(userId, date)
  )
`).run();

console.log("✅ MindCare database ready at", dbPath);
export default db;
