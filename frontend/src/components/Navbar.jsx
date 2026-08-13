import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-card border-b border-ink/10 sticky top-0 z-10">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🐾</span>
        <span className="font-display text-xl font-semibold text-pine">Pet Pantry</span>
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium text-ink/70">
        <Link to="/" className="hover:text-pine">Shop</Link>
        <Link to="/cart" className="hover:text-pine relative">
          Cart
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-marigold text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <Link to="/my-orders" className="hover:text-pine">My Orders</Link>
            {user.role === 'ADMIN' && (
                <Link to="/admin" className="hover:text-pine">Admin</Link>
            )}
            
            <span className="text-pine font-semibold">Hi, {user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} className="hover:text-clay">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:text-pine">Login</Link>
          
        )}
      </div>
    </nav>
  );
}

export default Navbar;