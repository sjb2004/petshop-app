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
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (selectedPet) params.append('petType', selectedPet);
      if (search) params.append('search', search);
      const query = params.toString() ? `?${params.toString()}` : '';

      api.get(`/products${query}`)
        .then((res) => setProducts(res.data.products))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }, 300); // debounce so it doesn't fetch on every keystroke

    return () => clearTimeout(timeout);
  }, [selectedPet, search]);

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

        <div className="mt-6 max-w-md relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for food, treats, toys..."
            className="w-full border border-ink/15 rounded-xl px-4 py-3 pl-11 bg-card outline-none focus:border-pine text-sm"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40">
            🔍
          </span>
        </div>
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
          <p className="font-mono text-sm text-ink/50">
            {search ? `No products found for "${search}".` : 'No products found.'}
          </p>
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