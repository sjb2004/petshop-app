import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 -mt-16">
        <div className="text-5xl mb-4">🛒</div>
        <p className="font-display text-2xl text-pine mb-2">Your cart is empty</p>
        <p className="text-ink/50 text-sm mb-6">Looks like you haven't added anything yet.</p>
        <Link
          to="/"
          className="bg-pine text-cream font-medium px-6 py-3 rounded-lg hover:bg-pine/90 transition-colors"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-8 py-10">
      <h1 className="font-display text-3xl font-semibold text-pine mb-8">Your Cart</h1>

      <div className="space-y-4 max-w-2xl">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="bg-card border border-ink/10 rounded-2xl p-5 flex items-center justify-between"
          >
            <div>
              <h2 className="font-display font-semibold text-ink">{product.name}</h2>
              <p className="font-mono text-sm text-clay">₹{product.price}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="w-8 h-8 rounded-full bg-cream border border-ink/15 hover:border-pine flex items-center justify-center font-mono text-sm"
              >
                -
              </button>
              <span className="font-mono w-6 text-center">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-8 h-8 rounded-full bg-cream border border-ink/15 hover:border-pine"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(product.id)}
                className="text-clay text-sm ml-4 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mt-8 pt-6 border-t border-ink/10 flex items-center justify-between">
        <span className="font-display text-2xl text-pine">
          Total: ₹{totalPrice}
        </span>
        <button
            onClick={() => navigate('/checkout')}
            className="bg-pine text-cream font-medium px-6 py-3 rounded-lg hover:bg-pine/90 transition-colors"
        >
  Checkout
</button>
      </div>
    </div>
  );
}

export default Cart;