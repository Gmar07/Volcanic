import { getMenu, saveMenu } from '../../../lib/dataStore.js';
import { requireAuth } from '../../../lib/withAuth.js';

const OWNER_ACCESS_CODE = process.env.OWNER_ACCESS_CODE || 'demo-owner-code';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const menu = (await getMenu()) || [];
    return res.status(200).json({ menu });
  }

  if (req.method === 'POST') {
    const payload = requireAuth(req, res);
    if (!payload) return;
    const { ownerCode } = req.body || {};
    if (ownerCode !== OWNER_ACCESS_CODE) {
      return res.status(403).json({ error: 'Owner code required to update menu' });
    }
    const { item } = req.body || {};
    if (!item || !item.name || !item.price) {
      return res.status(400).json({ error: 'Item name and price are required' });
    }
    const menu = (await getMenu()) || [];
    const exists = menu.find((i) => i.id === item.id);
    if (exists) {
      return res.status(400).json({ error: 'Item ID already exists; try editing instead' });
    }
    const newItem = {
      id: item.id || `${item.name.toLowerCase().replace(/\s+/g, '-')}-${menu.length + 1}`,
      name: item.name,
      description: item.description || '',
      price: Number(item.price),
      category: item.category || 'Chef Specials',
      available: item.available ?? true,
    };
    const updated = [...menu, newItem];
    await saveMenu(updated);
    return res.status(201).json({ menu: updated });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
