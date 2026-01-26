// Database initialization and access using Bun's native SQLite

import { Database } from "bun:sqlite";
import { config } from "./config";

let db: Database | null = null;

export function initDatabase(): void {
  try {
    db = new Database(config.databasePath, { create: true });

    db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER DEFAULT (unixepoch()),
        csrf_token TEXT
      )
    `);

    // Migration: Add csrf_token column if it doesn't exist (for existing databases)
    try {
      db.exec(`ALTER TABLE sessions ADD COLUMN csrf_token TEXT`);
    } catch {
      // Column already exists, ignore error
    }

    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        resume_name TEXT PRIMARY KEY,
        theme_color TEXT NOT NULL DEFAULT '#c9a86c',
        updated_at INTEGER DEFAULT (unixepoch())
      )
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)
    `);

    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed:", err);
    db = null;
  }
}

export function getDb(): Database | null {
  return db;
}
