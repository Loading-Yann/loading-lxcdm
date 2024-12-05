const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Récupère le token après "Bearer"

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifie le token
    req.user = decoded; // Ajoute les infos utilisateur à `req`
    next(); // Passe au middleware suivant ou à la route
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

module.exports = authMiddleware;
