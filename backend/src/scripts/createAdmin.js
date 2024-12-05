require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Modèle utilisateur

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connecté à MongoDB');

    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Un utilisateur admin existe déjà.');
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash('admin123', 10); // Remplacez par un mot de passe sécurisé
    const adminUser = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('Utilisateur admin créé avec succès.');
    process.exit();
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err.message);
    process.exit(1);
  });
