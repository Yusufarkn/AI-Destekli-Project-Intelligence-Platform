const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // JSON body parser

// Routes
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Project Risk AI API is running...'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint bulunamadı.'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});

module.exports = app;
