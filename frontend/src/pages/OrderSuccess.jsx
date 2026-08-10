import { Link } from 'react-router-dom';

function OrderSuccess() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      <div className="text-5xl mb-4">🎉</div>
      <p className="font-display text-3xl text-pine mb-2">Order placed!</p>
      <p className="text-ink/60 mb-6">We'll get your order ready and reach out soon.</p>
      <Link
        to="/"
        className="bg-pine text-cream font-medium px-6 py-3 rounded-lg hover:bg-pine/90 transition-colors"
      >
        Back to shop
      </Link>
    </div>
  );
}

export default OrderSuccess;