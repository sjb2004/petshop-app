require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // fine for now (single city/small scale); tighten origin whitelist before real deployment
app.use(express.json());

// --- Health check (useful once you deploy to Render, for uptime pings) ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
// Next: app.use('/api/products', productRoutes) once you build that in Phase 2

// --- 404 fallback ---
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Global error handler (catches anything thrown synchronously in routes) ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const authRoutes = require('./routes/auth.routes');
console.log('authRoutes type:', typeof authRoutes, authRoutes);