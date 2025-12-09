import Stripe from 'stripe';
import { requireAuth } from '../../../lib/withAuth.js';
import { requireEnv } from '../../../lib/dataStore.js';

export default async function handler(req, res) {
  const payload = requireAuth(req, res);
  if (!payload) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripeSecret = requireEnv('STRIPE_SECRET_KEY');
    const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' });
    const setupIntent = await stripe.setupIntents.create({
      usage: 'off_session',
      metadata: { userId: payload.id },
    });
    return res.status(200).json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to create setup intent', detail: err.message });
  }
}
