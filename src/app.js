const express = require('express');
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api', require('./routes'));

module.exports = app;
