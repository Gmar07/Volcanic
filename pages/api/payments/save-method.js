import { getPaymentMethods, savePaymentMethods } from '../../../lib/dataStore.js';
import { requireAuth } from '../../../lib/withAuth.js';

export default async function handler(req, res) {
  const payload = requireAuth(req, res);
  if (!payload) return;

  const methods = (await getPaymentMethods()) || {};
  const userMethods = methods[payload.id] || [];

  if (req.method === 'GET') {
    return res.status(200).json({ paymentMethods: userMethods });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentMethodId, brand, last4, expMonth, expYear } = req.body || {};
  if (!paymentMethodId) {
    return res.status(400).json({ error: 'paymentMethodId is required' });
  }

  const record = {
    paymentMethodId,
    brand: brand || 'card',
    last4: last4 || '****',
    expMonth: expMonth || null,
    expYear: expYear || null,
    savedAt: new Date().toISOString(),
  };
  const updated = { ...methods, [payload.id]: [...userMethods, record] };
  await savePaymentMethods(updated);
  return res.status(200).json({ paymentMethods: updated[payload.id] });
}
