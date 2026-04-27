const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const sprintRoutes = require('./routes/sprintRoutes');
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const riskRoutes = require('./routes/riskRoutes');
const mlRoutes = require('./routes/mlRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const taskController = require('./controllers/taskController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // JSON body parser

// Routes
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/sprints', sprintRoutes);
app.use('/tasks', taskRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/risk', riskRoutes);
app.use('/predict-delay', mlRoutes);
app.use('/prediction', predictionRoutes);
app.get('/workload/:userId', taskController.getWorkload);

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
