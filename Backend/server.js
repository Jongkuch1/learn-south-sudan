const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'SSPLP Backend API is running', status: 'healthy' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Basic API routes
app.get('/api/subjects', (req, res) => {
  res.json({ subjects: ['Mathematics', 'English', 'Biology', 'Physics', 'Chemistry'] });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint', user: { id: 1, name: 'Demo User' } });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ message: 'Registration endpoint', success: true });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
