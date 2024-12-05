const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Credential = require('../models/Credential');
require('dotenv').config(); // Charger les variables d'environnement

// Définir le chemin absolu du fichier JSON
const jsonFilePath = path.join(__dirname, 'sophosCredentials.json');

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connecté à MongoDB pour l\'importation.');
    importCredentials(); // Appeler la fonction d'importation après la connexion
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err.message);
    process.exit(1);
  });

// Fonction pour importer les credentials
const importCredentials = async () => {
  try {
    // Charger le fichier JSON
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    const credentials = JSON.parse(data);

    // Boucle pour insérer chaque credential
    for (const cred of credentials) {
      const existing = await Credential.findOne({ clientId: cred.clientId });
      if (existing) {
        console.log(`Le credential avec clientId "${cred.clientId}" existe déjà.`);
        continue;
      }

      const newCredential = new Credential(cred);
      await newCredential.save();
      console.log(`Credential ajouté pour "${cred.clientName}".`);
    }

    console.log('Importation terminée.');
    process.exit();
  } catch (err) {
    console.error('Erreur lors de l\'importation des credentials:', err.message);
    process.exit(1);
  }
};
