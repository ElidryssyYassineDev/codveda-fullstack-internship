const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/product.routes');
const authRoutes    = require('./routes/auth.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);

// Error handler must be registered LAST
app.use(errorHandler);

module.exports = app;