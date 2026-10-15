CREATE TABLE IF NOT EXISTS counts (
  id TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0
);

INSERT OR IGNORE INTO counts (id, count) VALUES ('main', 0);

CREATE TABLE IF NOT EXISTS clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clicked_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON clicks(clicked_at);

CREATE TABLE IF NOT EXISTS daily_counts (
  day TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);
