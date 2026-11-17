CREATE TABLE IF NOT EXISTS app_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  amount_cents INTEGER NOT NULL DEFAULT 1990,
  currency TEXT NOT NULL DEFAULT 'CNY',
  days INTEGER NOT NULL DEFAULT 30,
  node_limit INTEGER NOT NULL DEFAULT 10,
  traffic_gb INTEGER NOT NULL DEFAULT 100,
  sort_order INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO app_plans (id, name, amount_cents, currency, days, node_limit, traffic_gb, sort_order, enabled) VALUES
  ('trial_1d', '体验', 100, 'CNY', 1, 5, 5, 1, 1),
  ('basic_monthly', '基础', 1990, 'CNY', 30, 10, 100, 2, 1),
  ('advanced_monthly', '高级', 2990, 'CNY', 30, 15, 300, 3, 1),
  ('residential_monthly', '家宽', 5990, 'CNY', 30, 20, 500, 4, 1);

CREATE TABLE IF NOT EXISTS plan_selected_nodes (
  plan_id TEXT NOT NULL,
  node_id INTEGER NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  PRIMARY KEY (plan_id, node_id)
);

ALTER TABLE users ADD COLUMN plan_id TEXT NOT NULL DEFAULT 'trial_1d';

UPDATE users SET plan_id = CASE
  WHEN (SELECT plan_id FROM app_orders WHERE user_id = users.id AND status = 'paid' ORDER BY updated_at DESC, id DESC LIMIT 1) IN ('standard_monthly', 'standard_quarterly', 'standard_yearly') THEN 'advanced_monthly'
  ELSE COALESCE((SELECT plan_id FROM app_orders WHERE user_id = users.id AND status = 'paid' ORDER BY updated_at DESC, id DESC LIMIT 1), 'trial_1d')
END
WHERE EXISTS (SELECT 1 FROM app_orders WHERE user_id = users.id AND status = 'paid');
