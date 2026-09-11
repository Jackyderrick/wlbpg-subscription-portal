CREATE TABLE subscription_access_daily (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_date TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  device_kind TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT '',
  first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hits INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, access_date, fingerprint)
);

CREATE INDEX idx_subscription_access_recent
  ON subscription_access_daily(user_id, access_date DESC, last_seen_at DESC);
