import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Admin() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    petType: '',
    categoryId: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, statsRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/analytics/dashboard'),
      ]);
      setProducts(productsRes.data.products);
      setCategories(categoriesRes.data.categories);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCreateProduct(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/products', form);
      setForm({ name: '', description: '', price: '', stock: '', petType: '', categoryId: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create product');
    }
  }

  async function handleDeleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-display text-2xl text-clay">Admin access required</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-8 pt-16 pb-10">
      <h1 className="font-display text-3xl font-semibold text-pine mb-8">Admin Dashboard</h1>
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-card border border-ink/10 rounded-2xl p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-clay mb-2">Total Orders</p>
            <p className="font-display text-3xl font-semibold text-pine">{stats.totalOrders}</p>
            </div>
            <div className="bg-card border border-ink/10 rounded-2xl p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-clay mb-2">Total Revenue</p>
            <p className="font-display text-3xl font-semibold text-pine">₹{stats.totalRevenue}</p>
            </div>
            <div className="bg-card border border-ink/10 rounded-2xl p-6">
            <p className="font-mono text-xs uppercase tracking-wide text-clay mb-2">Low Stock Items</p>
            <p className="font-display text-3xl font-semibold text-pine">{stats.lowStockProducts.length}</p>
            </div>
        </div>
        )}

        {stats && stats.bestSellers.length > 0 && (
        <div className="bg-card border border-ink/10 rounded-2xl p-6 mb-10">
            <h2 className="font-display text-xl font-semibold text-pine mb-4">Best Sellers</h2>
            <div className="space-y-2">
            {stats.bestSellers.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm border-b border-ink/5 pb-2">
                <span className="text-ink">{item.name}</span>
                <span className="font-mono text-clay">{item.quantitySold} sold · ₹{item.revenue}</span>
                </div>
            ))}
            </div>
        </div>
        )}

        {stats && stats.lowStockProducts.length > 0 && (
        <div className="bg-clay/10 border border-clay/30 rounded-2xl p-6 mb-10">
            <h2 className="font-display text-xl font-semibold text-clay mb-4">⚠ Low Stock Alert</h2>
            <div className="space-y-2">
            {stats.lowStockProducts.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                <span className="text-ink">{item.name}</span>
                <span className="font-mono text-clay">{item.stock} left</span>
                </div>
            ))}
            </div>
        </div>
        )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={handleCreateProduct} className="bg-card border border-ink/10 rounded-2xl p-6 h-fit">
          <h2 className="font-display text-xl font-semibold text-pine mb-4">Add Product</h2>

          {error && (
            <p className="text-clay text-sm mb-4 bg-clay/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <label className="block text-sm font-medium text-ink/70 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-4 bg-cream outline-none focus:border-pine"
            required
          />

          <label className="block text-sm font-medium text-ink/70 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-4 bg-cream outline-none focus:border-pine"
            rows={2}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-4 bg-cream outline-none focus:border-pine"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-4 bg-cream outline-none focus:border-pine"
                required
              />
            </div>
          </div>

          <label className="block text-sm font-medium text-ink/70 mb-1">Pet Type</label>
          <select
            name="petType"
            value={form.petType}
            onChange={handleChange}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-4 bg-cream outline-none focus:border-pine"
          >
            <option value="">Select</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
          </select>

          <label className="block text-sm font-medium text-ink/70 mb-1">Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-6 bg-cream outline-none focus:border-pine"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-pine text-cream font-medium py-3 rounded-lg hover:bg-pine/90 transition-colors"
          >
            Add Product
          </button>
        </form>

        <div>
          <h2 className="font-display text-xl font-semibold text-pine mb-4">
            Products ({products.length})
          </h2>
          {loading ? (
            <p className="text-ink/50 font-mono text-sm">Loading...</p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-card border border-ink/10 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-display font-semibold text-ink">{product.name}</h3>
                    <p className="text-sm text-ink/50">
                      ₹{product.price} · {product.stock} in stock · {product.category?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-clay text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;