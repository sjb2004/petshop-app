import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  function handleAddToCart(e) {
    e.preventDefault(); // stop the Link navigation when clicking the button
    addToCart(product);
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="relative bg-card rounded-2xl border border-ink/10 p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 block"
    >
      <div className="absolute -top-3 -right-3 rotate-6">
        <div className="relative bg-marigold text-ink font-mono text-sm font-semibold px-3 py-1.5 rounded-md shadow-md">
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cream border border-ink/20" />
          {'\u20B9'}{product.price}
        </div>
      </div>

      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-40 object-cover rounded-xl mb-4"
        />
      ) : (
        <div className="w-full h-40 bg-pine/5 rounded-xl mb-4 flex items-center justify-center text-4xl">
          🐾
        </div>
      )}

      <span className="inline-block text-[11px] tracking-wide uppercase font-semibold text-pine bg-pine/10 px-2.5 py-1 rounded-full">
        {product.category?.name}
      </span>

      <h2 className="font-display text-xl font-semibold mt-3 text-ink">
        {product.name}
      </h2>
      <p className="text-sm text-ink/60 mt-1 line-clamp-2">
        {product.description}
      </p>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink/10">
        <span className="font-mono text-xs text-ink/50">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="bg-pine text-cream text-sm font-medium px-4 py-2 rounded-lg hover:bg-pine/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add to cart
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;