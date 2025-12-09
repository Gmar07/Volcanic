import fs from 'fs-extra';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

async function readJson(file) {
  const filePath = path.join(dataDir, file);
  const exists = await fs.pathExists(filePath);
  if (!exists) {
    return null;
  }
  return fs.readJson(filePath);
}

async function writeJson(file, data) {
  const filePath = path.join(dataDir, file);
  await fs.ensureFile(filePath);
  return fs.writeJson(filePath, data, { spaces: 2 });
}

export async function getMenu() {
  return readJson('menu.json');
}

export async function saveMenu(menu) {
  return writeJson('menu.json', menu);
}

export async function getUsers() {
  return readJson('users.json');
}

export async function saveUsers(users) {
  return writeJson('users.json', users);
}

export async function getFavorites() {
  return readJson('favorites.json');
}

export async function saveFavorites(favorites) {
  return writeJson('favorites.json', favorites);
}

export async function getPaymentMethods() {
  return readJson('paymentMethods.json');
}

export async function savePaymentMethods(methods) {
  return writeJson('paymentMethods.json', methods);
}

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
