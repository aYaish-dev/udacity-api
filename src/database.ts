import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  ENV
} = process.env;

const database = ENV === 'test' ? POSTGRES_TEST_DB : POSTGRES_DB;

const client = new Pool({
  host: POSTGRES_HOST,
  database,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: POSTGRES_PORT ? parseInt(POSTGRES_PORT) : 5432
});

export default client;
