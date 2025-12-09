import { getMenu, saveMenu } from '../../../lib/dataStore.js';
import { requireAuth } from '../../../lib/withAuth.js';

const OWNER_ACCESS_CODE = process.env.OWNER_ACCESS_CODE || 'demo-owner-code';

export default async function handler(req, res) {
  const { id } = req.query;
  const menu = (await getMenu()) || [];

  if (req.method === 'PUT') {
    const payload = requireAuth(req, res);
    if (!payload) return;
    const { ownerCode, item } = req.body || {};
    if (ownerCode !== OWNER_ACCESS_CODE) {
      return res.status(403).json({ error: 'Owner code required to update menu' });
    }
    const index = menu.findIndex((i) => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    const updatedItem = {
      ...menu[index],
      ...item,
      price: item?.price !== undefined ? Number(item.price) : menu[index].price,
    };
    const updated = [...menu];
    updated[index] = updatedItem;
    await saveMenu(updated);
    return res.status(200).json({ menu: updated });
  }

  if (req.method === 'DELETE') {
    const payload = requireAuth(req, res);
    if (!payload) return;
    const { ownerCode } = req.body || {};
    if (ownerCode !== OWNER_ACCESS_CODE) {
      return res.status(403).json({ error: 'Owner code required to delete menu items' });
    }
    const filtered = menu.filter((i) => i.id !== id);
    await saveMenu(filtered);
    return res.status(200).json({ menu: filtered });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
