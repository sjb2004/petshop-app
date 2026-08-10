import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { phone, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-2xl border border-ink/10 p-8 w-full max-w-sm"
      >
        <h1 className="font-display text-3xl font-semibold text-pine mb-6">
          Welcome back
        </h1>

        {error && (
          <p className="text-clay text-sm mb-4 bg-clay/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <label className="block text-sm font-medium text-ink/70 mb-1">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-4 bg-cream outline-none focus:border-pine"
          required
        />

        <label className="block text-sm font-medium text-ink/70 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-ink/15 rounded-lg px-3 py-2 mb-6 bg-cream outline-none focus:border-pine"
          required
        />

        <button
          type="submit"
          className="w-full bg-pine text-cream font-medium py-2.5 rounded-lg hover:bg-pine/90 transition-colors"
        >
          Log in
        </button>
        <p className="text-sm text-ink/60 text-center mt-4">
  New here?{' '}
  <Link to="/register" className="text-pine font-medium hover:underline">
    Create an account
  </Link>
</p>
      </form>
    </div>
  );
}

export default Login;