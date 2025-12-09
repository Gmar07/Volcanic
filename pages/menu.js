import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => setMenu(data.menu || []));
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setToken(parsed.token);
      refreshFavorites(parsed.token);
    }
  }, []);

  const refreshFavorites = async (tokenValue) => {
    const res = await fetch('/api/favorites', {
      headers: { Authorization: `Bearer ${tokenValue}` },
    });
    if (res.ok) {
      const data = await res.json();
      setFavorites(data.favorites || []);
    }
  };

  const addFavorite = async (itemId) => {
    if (!token) {
      setMessage('Log in to save favorites.');
      return;
    }
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemId }),
    });
    if (res.ok) {
      const data = await res.json();
      setFavorites(data.favorites);
      setMessage('Saved to favorites');
    }
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <h1>Menu</h1>
        {message && <p className="small">{message}</p>}
        <div className="grid">
          {menu.map((item) => (
            <div key={item.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{item.name}</h3>
                <span className="badge">${item.price.toFixed(2)}</span>
              </div>
              <p className="small">{item.description}</p>
              <p className="small">Category: {item.category}</p>
              <button onClick={() => addFavorite(item.id)}>
                {favorites.includes(item.id) ? 'Favorited' : 'Save favorite'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
