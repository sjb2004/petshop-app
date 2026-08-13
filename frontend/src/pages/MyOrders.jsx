import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const statusStyles = {
  PLACED: 'bg-marigold/20 text-clay',
  PACKED: 'bg-pine/10 text-pine',
  OUT_FOR_DELIVERY: 'bg-pine/20 text-pine',
  DELIVERED: 'bg-pine text-cream',
  CANCELLED: 'bg-clay/10 text-clay',
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then((res) => setOrders(res.data.orders))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream px-8 pt-16 pb-10">
        <p className="font-mono text-sm text-ink/50">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
        <p className="font-display text-2xl text-pine mb-2">No orders yet</p>
        <p className="text-ink/50 mb-6">When you place an order, it'll show up here.</p>
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
    <div className="min-h-screen bg-cream px-8 pt-16 pb-10">
      <h1 className="font-display text-3xl font-semibold text-pine mb-8">My Orders</h1>

      <div className="space-y-6 max-w-3xl">
        {orders.map((order) => (
          <div key={order.id} className="bg-card border border-ink/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-mono text-xs text-ink/50">
                  Order #{order.id.slice(0, 8)} · {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="font-display text-lg text-pine font-semibold mt-1">
                  ₹{order.totalAmount}
                </p>
              </div>
              <span className={`text-xs font-mono uppercase px-3 py-1.5 rounded-full ${statusStyles[order.status]}`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="border-t border-ink/10 pt-4 space-y-1">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-ink">{item.product.name} × {item.quantity}</span>
                  <span className="font-mono text-ink/50">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-ink/40 mt-4">
              Delivering to: {order.address.line1}, {order.address.city}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;