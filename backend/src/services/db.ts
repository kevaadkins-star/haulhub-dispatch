import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'haulhub.db');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password_hash TEXT,
    full_name TEXT,
    role TEXT,
    dot_number TEXT,
    mc_number TEXT,
    subscription_tier TEXT DEFAULT 'basic',
    subscription_status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS hos_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    date TEXT,
    driving_minutes INTEGER,
    on_duty_minutes INTEGER,
    off_duty_minutes INTEGER,
    sleeper_berth_minutes INTEGER,
    status TEXT
  );
  CREATE TABLE IF NOT EXISTS loads (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    origin TEXT,
    destination TEXT,
    pickup_date TEXT,
    delivery_date TEXT,
    rate INTEGER,
    weight INTEGER,
    status TEXT,
    broker TEXT,
    notes TEXT
  );
  CREATE TABLE IF NOT EXISTS carriers (
    id TEXT PRIMARY KEY,
    company_name TEXT,
    dot_number TEXT,
    mc_number TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    lease_terms TEXT,
    verified INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS dispatcher_assignments (
    id TEXT PRIMARY KEY,
    driver_id TEXT NOT NULL,
    dispatcher_id TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (driver_id) REFERENCES users(id),
    FOREIGN KEY (dispatcher_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS carrier_contacts (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    carrier_id TEXT REFERENCES carriers(id),
    message TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    subject TEXT,
    body TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
  );
`);

console.log('Database initialized at ' + DB_PATH);

export const query = (sql: string): any => {
  try {
    const trimmed = sql.trim().toUpperCase();
    const isSelect = trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA');
    if (isSelect) {
      return db.prepare(sql).all() as any[];
    } else {
      db.prepare(sql).run();
      return [];
    }
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

export const escape = (str: any): string => {
  if (str === null || str === undefined) return '';
  return str.replace(/'/g, "''");
};