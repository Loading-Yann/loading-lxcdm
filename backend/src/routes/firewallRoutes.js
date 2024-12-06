const express = require("express");
const { exec } = require("child_process");
const router = express.Router();

router.post("/refresh", (req, res) => {
  exec("python3 ./src/scripts/apisophos.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`Erreur: ${error.message}`);
      return res.status(500).json({ message: "Erreur lors de l'exécution du script." });
    }
    if (stderr) {
      console.error(`Erreur standard: ${stderr}`);
    }
    console.log(`Sortie: ${stdout}`);
    res.status(200).json({ message: "Données mises à jour avec succès." });
  });
});

module.exports = router;
