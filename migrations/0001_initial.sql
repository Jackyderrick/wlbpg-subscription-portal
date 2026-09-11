PRAGMA foreign_keys = ON;

CREATE TABLE upstreams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  subscription_url TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  last_synced_at TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  upstream_id INTEGER NOT NULL REFERENCES upstreams(id) ON DELETE CASCADE,
  fingerprint TEXT NOT NULL,
  name TEXT NOT NULL,
  protocol TEXT NOT NULL,
  original_server TEXT NOT NULL,
  original_uri TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(upstream_id, fingerprint)
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  token_hint TEXT NOT NULL,
  upstream_id INTEGER NOT NULL REFERENCES upstreams(id),
  expires_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','disabled','expired')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_dns_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  node_id INTEGER NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  hostname TEXT NOT NULL UNIQUE,
  record_type TEXT NOT NULL,
  record_content TEXT NOT NULL,
  cloudflare_record_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, node_id)
);

CREATE INDEX idx_users_expiry ON users(status, expires_at);
CREATE INDEX idx_nodes_upstream ON nodes(upstream_id, active);
CREATE INDEX idx_dns_user ON user_dns_records(user_id, status);
