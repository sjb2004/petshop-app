require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://your-vercel-url.vercel.app'],
}));

app.use(express.json());
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const categoryRoutes = require('./routes/category.routes');
app.use('/api/categories', categoryRoutes);

const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

const orderRoutes = require('./routes/order.routes');
app.use('/api/orders', orderRoutes);

const addressRoutes = require('./routes/address.routes');
app.use('/api/addresses', addressRoutes);

const analyticsRoutes = require('./routes/analytics.routes');
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.send('Pet shop API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
