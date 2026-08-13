import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-mono text-sm text-ink/50">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
        <p className="font-display text-2xl text-clay mb-4">Product not found</p>
        <Link to="/" className="text-pine font-medium hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-8 pt-16 pb-10">
      <Link to="/" className="text-sm text-ink/50 hover:text-pine mb-6 inline-block">
        ← Back to shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl">
        <div className="bg-card border border-ink/10 rounded-2xl aspect-square flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl">🐾</span>
          )}
        </div>

        <div>
          <span className="inline-block text-[11px] tracking-wide uppercase font-semibold text-pine bg-pine/10 px-2.5 py-1 rounded-full">
            {product.category?.name}
          </span>

          <h1 className="font-display text-4xl font-semibold text-ink mt-4">
            {product.name}
          </h1>

          <p className="font-mono text-2xl text-clay mt-4">₹{product.price}</p>

          <p className="text-ink/70 mt-4 leading-relaxed">
            {product.description || 'No description available.'}
          </p>

          {product.petType && (
            <p className="text-sm text-ink/50 mt-4">
              Suitable for: <span className="font-medium text-ink">{product.petType}</span>
            </p>
          )}

          <p className="font-mono text-sm text-ink/50 mt-2">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="mt-8 w-full sm:w-auto bg-pine text-cream font-medium px-8 py-3 rounded-lg hover:bg-pine/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {added ? 'Added ✓' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;