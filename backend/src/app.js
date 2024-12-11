const express = require('express');
const app = express();
const firewallRoutes = require('./routes/firewallRoutes');

// Middleware pour parser le JSON
app.use(express.json());
app.use('/firewalls', firewallRoutes);

// Exemple de route principale
app.get('/', (req, res) => {
  console.log('Route principale atteinte');
  res.send('Bienvenue sur Loading-LXCDM 🚀');
});

// Routes protégées
const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api/protected', protectedRoutes);

module.exports = app;
