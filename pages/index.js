import NavBar from '../components/NavBar';

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="container">
        <div className="card">
          <h1>Pickup-only ordering for Volcanic Sushi & Sake</h1>
          <p className="small">
            Build a cart, save your favorites, and keep your payment method vaulted with Stripe. Restaurant staff can
            update the menu safely from the Menu Admin screen using a private owner code.
          </p>
          <div className="grid" style={{ marginTop: 16 }}>
            <div className="card">
              <h3>Guests</h3>
              <p className="small">Browse the live menu, add items, and check out with secure card capture.</p>
            </div>
            <div className="card">
              <h3>Members</h3>
              <p className="small">Create an account to save favorite orders, reuse payment methods, and speed up pickup.</p>
            </div>
            <div className="card">
              <h3>Owners</h3>
              <p className="small">Use the owner code to add, edit, or disable menu items without editing any code.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
