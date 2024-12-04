require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🚀 Connecté à MongoDB Atlas');

    // Démarrage du serveur après connexion réussie
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur en cours d'exécution sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion à MongoDB :', err.message);
  });
