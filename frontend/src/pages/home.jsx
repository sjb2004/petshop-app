import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const petTypes = [
  { label: 'All', value: '' },
  { label: 'Dogs', value: 'dog', emoji: '🐕' },
  { label: 'Cats', value: 'cat', emoji: '🐈' },
  { label: 'Birds', value: 'bird', emoji: '🦜' },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState('');

  useEffect(() => {
    setLoading(true);
    const query = selectedPet ? `?petType=${selectedPet}` : '';
    api.get(`/products${query}`)
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedPet]);

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-ink/10 px-8 py-10">
        <p className="font-mono text-xs uppercase tracking-widest text-clay mb-2">
          Mumbai - Local Delivery
        </p>
        <h1 className="font-display text-5xl font-semibold text-pine">
          The Neighborhood Pet Pantry
        </h1>
        <p className="text-ink/60 mt-2 max-w-md">
          Food, treats, and accessories for the pets on your street, picked and packed by us.
        </p>
      </header>

      <div className="px-8 flex gap-4 py-8">
        {petTypes.map((pet) => (
          <button
            key={pet.value}
            onClick={() => setSelectedPet(pet.value)}
            className={`flex-1 border rounded-2xl py-6 text-center transition-all ${
              selectedPet === pet.value
                ? 'bg-pine text-cream border-pine'
                : 'bg-card border-ink/10 hover:border-pine'
            }`}
          >
            <div className="text-3xl mb-2">{pet.emoji || '🐾'}</div>
            <div className="font-display font-semibold">{pet.label}</div>
          </button>
        ))}
      </div>

      <main className="px-8 py-6">
        {loading ? (
          <p className="font-mono text-sm text-ink/50">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="font-mono text-sm text-ink/50">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;