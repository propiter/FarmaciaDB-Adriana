require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Database connection
require('./config/database');

// Setup scheduled jobs
if (process.env.NODE_ENV !== 'test') {
  try {
    require('./jobs/notification.jobs')();
  } catch (error) {
    console.warn('Notification jobs not loaded:', error.message);
  }
}

// Swagger documentation
require('./utils/swagger')(app);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/productos', require('./routes/product.routes'));
app.use('/api/lotes', require('./routes/batch.routes'));
app.use('/api/ventas', require('./routes/sale.routes'));
app.use('/api/compras', require('./routes/purchase.routes'));
app.use('/api/recepciones', require('./routes/receiving.routes'));
app.use('/api/clientes', require('./routes/client.routes'));
app.use('/api/reportes', require('./routes/report.routes'));
app.use('/api/config', require('./routes/config.routes'));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});
