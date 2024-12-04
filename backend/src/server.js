require('dotenv').config(); // Charge les variables d'environnement depuis .env
const express = require('express');
const app = require('./app'); // Importez la configuration de votre application

// Port depuis .env ou par défaut 5000
const PORT = process.env.PORT || 5000;

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en cours d'exécution sur le port ${PORT}`);
});
