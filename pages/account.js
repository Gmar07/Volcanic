import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

export default function AccountPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [mode, setMode] = useState('login');
  const [auth, setAuth] = useState(null);
  const [message, setMessage] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentForm, setPaymentForm] = useState({ paymentMethodId: '', brand: '', last4: '', expMonth: '', expYear: '' });

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setAuth(parsed);
      refreshFavorites(parsed.token);
      refreshPaymentMethods(parsed.token);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      const authData = { token: data.token, user: data.user };
      localStorage.setItem('auth', JSON.stringify(authData));
      setAuth(authData);
      setMessage('Signed in successfully');
      refreshFavorites(data.token);
      refreshPaymentMethods(data.token);
    } else {
      setMessage(data.error || 'Unable to authenticate');
    }
  };

  const refreshFavorites = async (tokenValue) => {
    const res = await fetch('/api/favorites', { headers: { Authorization: `Bearer ${tokenValue}` } });
    if (res.ok) {
      const data = await res.json();
      setFavorites(data.favorites || []);
    }
  };

  const refreshPaymentMethods = async (tokenValue) => {
    const res = await fetch('/api/payments/save-method', { headers: { Authorization: `Bearer ${tokenValue}` } });
    if (res.ok) {
      const data = await res.json();
      setPaymentMethods(data.paymentMethods || []);
    }
  };

  const savePaymentMethod = async () => {
    if (!auth) return;
    const res = await fetch('/api/payments/save-method', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify(paymentForm),
    });
    const data = await res.json();
    if (res.ok) {
      setPaymentMethods(data.paymentMethods);
      setMessage('Payment method saved (card stored with Stripe only)');
      setPaymentForm({ paymentMethodId: '', brand: '', last4: '', expMonth: '', expYear: '' });
    } else {
      setMessage(data.error || 'Unable to save payment method');
    }
  };

  const launchSetupIntent = async () => {
    if (!auth) return setMessage('Sign in to start card capture.');
    const res = await fetch('/api/payments/setup-intent', {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Use Stripe.js to confirm this setup intent: ${data.clientSecret}`);
    } else {
      setMessage(data.error || 'Unable to start setup intent');
    }
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="grid">
          <div className="card">
            <h2>{mode === 'login' ? 'Log in' : 'Create account'}</h2>
            <form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <label className="small">
                  Name
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                  />
                </label>
              )}
              <label className="small">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </label>
              <label className="small">
                Password
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
              </label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button type="submit">{mode === 'login' ? 'Log in' : 'Sign up'}</button>
                <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                  Switch to {mode === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </div>
            </form>
            {message && <p className="small">{message}</p>}
          </div>

          <div className="card">
            <h2>Favorites</h2>
            {auth ? (
              favorites.length ? (
                <ul>
                  {favorites.map((fav) => (
                    <li key={fav} className="small">
                      {fav}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="small">No favorites yet. Save items from the Menu page.</p>
              )
            ) : (
              <p className="small">Log in to see your favorites.</p>
            )}
          </div>

          <div className="card">
            <h2>Saved payment methods</h2>
            <p className="small">
              Cards are vaulted with Stripe; only non-sensitive metadata is stored here for reuse.
            </p>
            {auth ? (
              <>
                <div className="small" style={{ marginBottom: 8 }}>
                  <strong>Existing methods</strong>
                  <ul>
                    {paymentMethods.map((pm) => (
                      <li key={pm.paymentMethodId}>
                        {pm.brand} ••••{pm.last4} exp {pm.expMonth}/{pm.expYear}
                      </li>
                    ))}
                  </ul>
                </div>
                <button type="button" onClick={launchSetupIntent} style={{ marginBottom: 8 }}>
                  Start secure card capture (Stripe SetupIntent)
                </button>
                <div className="card" style={{ background: '#111', border: '1px dashed #333' }}>
                  <p className="small">Paste the Stripe payment method details after confirmation.</p>
                  <label className="small">
                    Payment method ID
                    <input
                      value={paymentForm.paymentMethodId}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethodId: e.target.value })}
                      placeholder="pm_xxx"
                    />
                  </label>
                  <label className="small">
                    Brand
                    <input
                      value={paymentForm.brand}
                      onChange={(e) => setPaymentForm({ ...paymentForm, brand: e.target.value })}
                      placeholder="visa"
                    />
                  </label>
                  <label className="small">
                    Last 4
                    <input
                      value={paymentForm.last4}
                      onChange={(e) => setPaymentForm({ ...paymentForm, last4: e.target.value })}
                      placeholder="4242"
                    />
                  </label>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <label className="small">
                      Exp month
                      <input
                        value={paymentForm.expMonth}
                        onChange={(e) => setPaymentForm({ ...paymentForm, expMonth: e.target.value })}
                      />
                    </label>
                    <label className="small">
                      Exp year
                      <input
                        value={paymentForm.expYear}
                        onChange={(e) => setPaymentForm({ ...paymentForm, expYear: e.target.value })}
                      />
                    </label>
                  </div>
                  <button type="button" onClick={savePaymentMethod} style={{ marginTop: 8 }}>
                    Save metadata
                  </button>
                </div>
              </>
            ) : (
              <p className="small">Log in to view and save payment methods.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
