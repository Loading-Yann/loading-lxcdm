const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Route pour lire les firewalls depuis le fichier JSON local
router.get("/local", (req, res) => {
  const filePath = path.join(__dirname, "../scripts/firewalls.json");
  try {
    if (!fs.existsSync(filePath)) {
      console.error("[ERROR] Fichier firewalls.json introuvable.");
      return res.status(404).json({ message: "Fichier firewalls.json introuvable." });
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileContent);
    console.log("[DEBUG] Contenu du fichier firewalls.json :", jsonData);
    res.status(200).json(jsonData);
  } catch (error) {
    console.error("[ERROR] Erreur lors de la lecture du fichier firewalls.json :", error);
    res.status(500).json({ message: "Erreur lors de la lecture des données locales." });
  }
});

module.exports = router;
