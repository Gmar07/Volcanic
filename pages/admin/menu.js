import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';

export default function MenuAdminPage() {
  const [menu, setMenu] = useState([]);
  const [auth, setAuth] = useState(null);
  const [ownerCode, setOwnerCode] = useState('');
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', available: true });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => setMenu(data.menu || []));
    const stored = localStorage.getItem('auth');
    if (stored) {
      setAuth(JSON.parse(stored));
    }
  }, []);

  const saveItem = async () => {
    if (!auth) return setMessage('Log in first');
    const payload = { ownerCode, item: { ...form, price: Number(form.price) } };
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setMenu(data.menu);
      setMessage('Added menu item');
      setForm({ name: '', description: '', category: '', price: '', available: true });
    } else {
      setMessage(data.error || 'Unable to save item');
    }
  };

  const toggleAvailability = async (item) => {
    if (!auth) return setMessage('Log in first');
    const res = await fetch(`/api/menu/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify({ ownerCode, item: { available: !item.available } }),
    });
    const data = await res.json();
    if (res.ok) {
      setMenu(data.menu);
      setMessage('Availability updated');
    } else {
      setMessage(data.error || 'Unable to update item');
    }
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="card">
          <h2>Menu Admin</h2>
          <p className="small">Enter the owner code and add items without touching code or styling.</p>
          <label className="small">
            Owner code (provided privately)
            <input value={ownerCode} onChange={(e) => setOwnerCode(e.target.value)} />
          </label>
          <div className="grid" style={{ marginTop: 12 }}>
            <label className="small">
              Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="small">
              Category
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </label>
            <label className="small">
              Price
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </label>
          </div>
          <label className="small">
            Description
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label className="small" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
              style={{ width: 'auto' }}
            />
            Available for ordering
          </label>
          <button type="button" onClick={saveItem} style={{ marginTop: 8 }}>
            Add menu item
          </button>
          {message && <p className="small">{message}</p>}
        </div>

        <div className="grid" style={{ marginTop: 20 }}>
          {menu.map((item) => (
            <div key={item.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3>{item.name}</h3>
                  <p className="small">{item.description}</p>
                  <p className="small">${item.price.toFixed(2)}</p>
                </div>
                <span className="badge">{item.available ? 'Live' : 'Hidden'}</span>
              </div>
              <button type="button" onClick={() => toggleAvailability(item)}>
                {item.available ? 'Hide from menu' : 'Mark available'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
