import { authenticateUser, issueToken } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await authenticateUser({ email, password });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = issueToken(user);
  return res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name } });
}
