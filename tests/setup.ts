import { createConnection } from '../lib/db';
import type Database from 'better-sqlite3';

export function makeTestDb(): Database.Database {
  return createConnection(':memory:');
}