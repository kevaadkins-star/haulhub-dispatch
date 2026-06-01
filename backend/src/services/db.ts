import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'haulhub.db');

let db: any = null;
let queryFn: ((sql: string) => any) | null = null;
let escapeFn: ((str: any) => string) | null = null;

export async function initDb() {
  const SQL = await initSqlJs();
  
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, email TEXT UNIQUE, password_hash TEXT, full_name TEXT, role TEXT,
    dot_number TEXT, mc_number TEXT, subscription_tier TEXT DEFAULT 'basic',
    subscription_status TEXT DEFAULT 'active', created_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS hos_logs (
    id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), date TEXT,
    driving_minutes INTEGER, on_duty_minutes INTEGER, off_duty_minutes INTEGER,
    sleeper_berth_minutes INTEGER, status TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS loads (
    id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), origin TEXT, destination TEXT,
    pickup_date TEXT, delivery_date TEXT, rate INTEGER, weight INTEGER,
    status TEXT, broker TEXT, notes TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS carriers (
    id TEXT PRIMARY KEY, company_name TEXT, dot_number TEXT, mc_number TEXT,
    contact_phone TEXT, contact_email TEXT, lease_terms TEXT, verified INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS dispatcher_assignments (
    id TEXT PRIMARY KEY, driver_id TEXT NOT NULL, dispatcher_id TEXT NOT NULL,
    status TEXT DEFAULT 'active', created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (driver_id) REFERENCES users(id), FOREIGN KEY (dispatcher_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS carrier_contacts (
    id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id),
    carrier_id TEXT REFERENCES carriers(id), message TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY, sender_id TEXT NOT NULL, receiver_id TEXT NOT NULL,
    subject TEXT, body TEXT NOT NULL, read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (sender_id) REFERENCES users(id), FOREIGN KEY (receiver_id) REFERENCES users(id)
  )`);

  saveDb();
  console.log('Database initialized at ' + DB_PATH);
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export function query(sql: string): any {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  const trimmed = sql.trim().toUpperCase();
  const isSelect = trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA');
  const result = db.exec(sql);
  if (isSelect) {
    if (result.length === 0) return [];
    const cols = result[0].columns;
    const vals = result[0].values;
    return vals.map((row: any[]) => {
      const obj: any = {};
      cols.forEach((col: string, i: number) => { obj[col] = row[i]; });
      return obj;
    });
  } else {
    saveDb();
    return [];
  }
}

export function escape(str: any): string {
  if (str === null || str === undefined) return '';
  return str.replace(/'/g, "''");
}