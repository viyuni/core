import { drizzle } from 'drizzle-orm/node-postgres';

import { loadConfig } from '../config';
import * as schema from './schema';
export * as schema from './schema';

const { DATABASE_URL } = loadConfig();
export const db = drizzle(DATABASE_URL, { schema });
