const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const app = express();

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('🚀 Connecté à MongoDB Atlas'))
  .catch((err) => {
    console.error('❌ Erreur de connexion à MongoDB :', err.message);
  });

// Middleware pour parser les JSON
app.use(express.json());

// Exemple de route
app.get('/', (req, res) => {
  res.send('Bienvenue sur Loading-LXCDM 🚀');
});

// Route de test pour MongoDB
const Credential = require('./models/Credential');

app.get('/test-db', async (req, res) => {
  try {
    const newCredential = new Credential({
      clientId: 'exampleClientId',
      clientSecret: 'exampleSecret',
      clientName: 'Example Client',
    });
    await newCredential.save();
    res.status(200).send('Donnée ajoutée à MongoDB');
  } catch (err) {
    res.status(500).send('Erreur : ' + err.message);
  }
});

module.exports = app;
