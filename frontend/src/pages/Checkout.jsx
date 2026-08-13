import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

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

  useEffect(() => {
    if (!user) return;
    api.get('/addresses')
      .then((res) => {
        setSavedAddresses(res.data.addresses);
        if (res.data.addresses.length === 0) {
          setShowNewForm(true);
        } else {
          setSelectedAddressId(res.data.addresses[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, [user]);

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
      let addressId = selectedAddressId;

      // If using a new address, create it first
      if (showNewForm) {
        const addressRes = await api.post('/addresses', address);
        addressId = addressRes.data.address.id;
      }

      if (!addressId) {
        setError('Please select or add a delivery address');
        setLoading(false);
        return;
      }

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

          {savedAddresses.length > 0 && !showNewForm && (
            <div className="space-y-3 mb-4">
              {savedAddresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`block border rounded-xl p-4 cursor-pointer transition-colors ${
                    selectedAddressId === addr.id
                      ? 'border-pine bg-pine/5'
                      : 'border-ink/15 hover:border-pine/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="savedAddress"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold text-ink text-sm">{addr.label}</p>
                      <p className="text-ink/60 text-sm">
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                  </div>
                </label>
              ))}

              <button
                type="button"
                onClick={() => setShowNewForm(true)}
                className="text-pine text-sm font-medium hover:underline"
              >
                + Use a new address
              </button>
            </div>
          )}

          {showNewForm && (
            <div>
              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="text-pine text-sm font-medium hover:underline mb-4"
                >
                  ← Choose a saved address
                </button>
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
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pine text-cream font-medium py-3 rounded-lg hover:bg-pine/90 transition-colors disabled:opacity-50 mt-2"
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