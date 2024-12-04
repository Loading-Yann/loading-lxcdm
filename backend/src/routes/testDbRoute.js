const express = require('express');
const router = express.Router();
const Credential = require('../models/Credential');

router.get('/', async (req, res) => {
  console.log('Route test-db atteinte');
  try {
    const newCredential = new Credential({
      clientId: 'exampleClientId',
      clientSecret: 'exampleSecret',
      clientName: 'Example Client',
    });
    console.log('Création d\'un nouveau credential:', newCredential);
    await newCredential.save();
    res.status(200).send('Donnée ajoutée à MongoDB');
  } catch (err) {
    console.error('Erreur lors de l\'ajout à MongoDB:', err);
    res.status(500).send('Erreur : ' + err.message);
  }
});


module.exports = router;
