import { config } from 'dotenv';
import { resolve } from 'path';

// Load backend/.env into process.env before any module reads it.
// Existing process/platform variables are never overridden.
config({ path: resolve(__dirname, '../.env') });
