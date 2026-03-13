const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./complaints.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to SQLite database.");
});

db.run(`
CREATE TABLE IF NOT EXISTS complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  category TEXT,
  location TEXT,
  status TEXT DEFAULT 'Submitted',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

module.exports = db;
