CREATE TABLE IF NOT EXISTS app_user_profiles (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email TEXT,
  normalized_email TEXT,
  email_bound_at TEXT,
  phone TEXT,
  nickname TEXT,
  remark TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_app_user_profiles_normalized_email
  ON app_user_profiles(normalized_email)
  WHERE normalized_email IS NOT NULL;
