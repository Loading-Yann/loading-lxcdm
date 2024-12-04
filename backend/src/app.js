const express = require('express');
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Exemple de route
app.get('/', (req, res) => {
  console.log('Route principale atteinte');
  res.send('Bienvenue sur Loading-LXCDM 🚀');
});


// Importer et utiliser les routes
const testDbRoute = require('./routes/testDbRoute');
app.use('/test-db', testDbRoute);

module.exports = app;
