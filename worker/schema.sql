CREATE TABLE IF NOT EXISTS counts (
  id TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0
);

INSERT OR IGNORE INTO counts (id, count) VALUES ('main', 0);

CREATE TABLE IF NOT EXISTS clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clicked_at TEXT DEFAULT (datetime('now'))
);
