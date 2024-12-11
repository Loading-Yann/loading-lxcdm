const express = require("express");
const { exec } = require("child_process");
const router = express.Router();
const path = require("path");

// Route pour exécuter le script Python
router.post("/refresh", (req, res) => {
  const scriptPath = path.join(__dirname, "../scripts/apisophos.py");

  exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur lors de l'exécution du script: ${error.message}`);
      return res.status(500).json({ message: "Erreur lors de l'exécution du script." });
    }
    if (stderr) {
      console.error(`Erreur standard: ${stderr}`);
    }
    console.log(`Sortie: ${stdout}`);
    res.status(200).json({ message: "Données mises à jour avec succès.", output: stdout });
  });
});

// Route pour récupérer les données des firewalls depuis MongoDB
router.get("/", async (req, res) => {
  const mongoose = require("mongoose");
  const Firewall = require("../models/Firewall");

  try {
    const firewalls = await Firewall.find();
    res.status(200).json(firewalls);
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des données." });
  }
});

module.exports = router;
