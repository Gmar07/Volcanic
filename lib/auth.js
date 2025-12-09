import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUsers, saveUsers } from './dataStore.js';
import { v4 as uuidv4 } from 'uuid';

const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || 'dev-secret-change-me';

export async function createUser({ email, password, name }) {
  const users = (await getUsers()) || [];
  const existing = users.find((u) => u.email === email);
  if (existing) {
    throw new Error('Email already registered');
  }
  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = { id, email, name, passwordHash };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
}

export async function authenticateUser({ email, password }) {
  const users = (await getUsers()) || [];
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return null;
  return user;
}

export function issueToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, TOKEN_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch (err) {
    return null;
  }
}
