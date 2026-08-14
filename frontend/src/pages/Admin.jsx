import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Admin() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    petType: '',
    categoryId: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, statsRes, ordersRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/analytics/dashboard'),
        api.get('/orders'),
      ]);
      setProducts(productsRes.data.products);
      setCategories(categoriesRes.data.categories);
      setStats(statsRes.data);
      setOrders(ordersRes.data.orders);
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
      setForm({ name: '', description: '', price: '', stock: '', petType: '', categoryId: '', imageUrl: '' });
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

  async function handleStatusChange(orderId, newStatus) {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      loadData();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
  
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ckpgeroq'); 
  
    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/wevke5v2/image/upload', // replace YOUR_CLOUD_NAME
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      setForm((prev) => ({ ...prev, imageUrl: data.secure_url }));
    } catch (err) {
      console.error(err);
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function loadWeeklySummary() {
    setSummaryLoading(true);
    try {
      const res = await api.get('/analytics/weekly-summary');
      setWeeklySummary(res.data.summary);
    } catch (err) {
      console.error(err);
      setWeeklySummary('Unable to generate summary right now.');
    } finally {
      setSummaryLoading(false);
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

      <div className="bg-pine text-cream rounded-2xl p-6 mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-semibold">✨ Weekly AI Summary</h2>
          <button
            onClick={loadWeeklySummary}
            disabled={summaryLoading}
            className="text-xs font-mono bg-cream/10 hover:bg-cream/20 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
          >
            {summaryLoading ? 'Generating...' : weeklySummary ? 'Regenerate' : 'Generate'}
          </button>
        </div>
        {weeklySummary ? (
          <p className="text-cream/90 leading-relaxed">{weeklySummary}</p>
        ) : (
          <p className="text-cream/60 text-sm">Click "Generate" to get an AI-powered summary of this week's sales.</p>
        )}
      </div>

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
        <div className="bg-card border border-ink/10 rounded-2xl p-6 mb-10">
        <h2 className="font-display text-xl font-semibold text-pine mb-4">
          Manage Orders ({orders.length})
        </h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-ink/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-mono text-xs text-ink/50">
                    #{order.id.slice(0, 8)} · {order.user?.name} · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="font-display text-pine font-semibold">₹{order.totalAmount}</p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="border border-ink/15 rounded-lg px-3 py-1.5 text-sm bg-cream outline-none focus:border-pine"
                >
                  <option value="PLACED">Placed</option>
                  <option value="PACKED">Packed</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="text-xs text-ink/50">
                {order.items.map((item) => `${item.product.name} ×${item.quantity}`).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

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
          <label className="block text-sm font-medium text-ink/70 mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-sm mb-4"
          />
          {uploading && <p className="text-xs text-clay mb-4">Uploading...</p>}
          {form.imageUrl && (
            <img src={form.imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg mb-4 border border-ink/10" />
          )}

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