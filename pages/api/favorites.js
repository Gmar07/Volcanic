import { getFavorites, saveFavorites } from '../../lib/dataStore.js';
import { requireAuth } from '../../lib/withAuth.js';

export default async function handler(req, res) {
  const payload = requireAuth(req, res);
  if (!payload) return;

  const favorites = (await getFavorites()) || {};
  const userFavorites = favorites[payload.id] || [];

  if (req.method === 'GET') {
    return res.status(200).json({ favorites: userFavorites });
  }

  if (req.method === 'POST') {
    const { itemId } = req.body || {};
    if (!itemId) {
      return res.status(400).json({ error: 'Menu item ID is required' });
    }
    const updated = Array.from(new Set([...userFavorites, itemId]));
    const updatedFavorites = { ...favorites, [payload.id]: updated };
    await saveFavorites(updatedFavorites);
    return res.status(200).json({ favorites: updated });
  }

  if (req.method === 'DELETE') {
    const { itemId } = req.body || {};
    const updated = userFavorites.filter((id) => id !== itemId);
    const updatedFavorites = { ...favorites, [payload.id]: updated };
    await saveFavorites(updatedFavorites);
    return res.status(200).json({ favorites: updated });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
