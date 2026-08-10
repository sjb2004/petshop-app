import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    label: 'Home',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Step 1: create the address
      const addressRes = await api.post('/addresses', address);
      const addressId = addressRes.data.address.id;

      // Step 2: create the order
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      await api.post('/orders', { addressId, items: orderItems });

      clearCart();
      navigate('/order-success');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-display text-2xl text-pine">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-8 pt-16 pb-10">
      <h1 className="font-display text-3xl font-semibold text-pine mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-4xl">
        <form onSubmit={handlePlaceOrder} className="bg-card border border-ink/10 rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold text-pine mb-4">Delivery Address</h2>

          {error && (
            <p className="text-clay text-sm mb-4 bg-clay/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <label className="block text-sm font-medium text-ink/70 mb-1">Label</label>
          <input
            name="label"
            value={address.label}
            onChange={handleChange}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-4 bg-cream outline-none focus:border-pine"
            required
          />

          <label className="block text-sm font-medium text-ink/70 mb-1">Address Line 1</label>
          <input
            name="line1"
            value={address.line1}
            onChange={handleChange}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-4 bg-cream outline-none focus:border-pine"
            required
          />

          <label className="block text-sm font-medium text-ink/70 mb-1">Address Line 2 (optional)</label>
          <input
            name="line2"
            value={address.line2}
            onChange={handleChange}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-4 bg-cream outline-none focus:border-pine"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">City</label>
              <input
                name="city"
                value={address.city}
                onChange={handleChange}
                className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-4 bg-cream outline-none focus:border-pine"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">State</label>
              <input
                name="state"
                value={address.state}
                onChange={handleChange}
                className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-4 bg-cream outline-none focus:border-pine"
                required
              />
            </div>
          </div>

          <label className="block text-sm font-medium text-ink/70 mb-1">Pincode</label>
          <input
            name="pincode"
            value={address.pincode}
            onChange={handleChange}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-6 bg-cream outline-none focus:border-pine"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pine text-cream font-medium py-3 rounded-lg hover:bg-pine/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Placing order...' : 'Place Order'}
          </button>
        </form>

        <div className="bg-card border border-ink/10 rounded-2xl p-6 h-fit">
          <h2 className="font-display text-xl font-semibold text-pine mb-4">Order Summary</h2>
          <div className="space-y-3">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-ink">{product.name} × {quantity}</span>
                <span className="font-mono text-clay">₹{product.price * quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-ink/10 mt-4 pt-4 flex justify-between font-display text-lg text-pine">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;