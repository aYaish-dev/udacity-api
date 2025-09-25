import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../database';
import { User } from './types';
import dotenv from 'dotenv';

dotenv.config();

const { BCRYPT_PASSWORD, SALT_ROUNDS, TOKEN_SECRET } = process.env;

const pepper = BCRYPT_PASSWORD || '';
const saltRounds = parseInt(SALT_ROUNDS || '10');

export class UserModel {
  async index(): Promise<Omit<User, 'password'>[]> {
    const conn = await client.connect();
    try {
      const result = await conn.query('SELECT id, first_name, last_name, email FROM users ORDER BY id');
      return result.rows;
    } finally {
      conn.release();
    }
  }

  async show(id: number): Promise<Omit<User, 'password'> | null> {
    const conn = await client.connect();
    try {
      const result = await conn.query('SELECT id, first_name, last_name, email FROM users WHERE id=$1', [id]);
      return result.rows[0] || null;
    } finally {
      conn.release();
    }
  }

  async create(u: User): Promise<string> {
    const conn = await client.connect();
    try {
      const hash = bcrypt.hashSync((u.password as string) + pepper, saltRounds);
      const sql = `INSERT INTO users (first_name, last_name, email, password_digest)
                   VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email`;
      const result = await conn.query(sql, [u.first_name, u.last_name, u.email, hash]);
      const user = result.rows[0];
      const token = jwt.sign({ user }, TOKEN_SECRET as string);
      return token;
    } finally {
      conn.release();
    }
  }

  async authenticate(email: string, password: string): Promise<string | null> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM users WHERE email=$1';
      const result = await conn.query(sql, [email]);
      const user = result.rows[0];
      if (!user) return null;
      const valid = bcrypt.compareSync(password + pepper, user.password_digest);
      if (!valid) return null;
      const token = jwt.sign({ user: { id: user.id, email: user.email } }, TOKEN_SECRET as string);
      return token;
    } finally {
      conn.release();
    }
  }
}
