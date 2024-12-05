const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/admin-only', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.json({ message: 'Bienvenue admin' });
});

router.get('/user-data', authMiddleware, (req, res) => {
  res.json({ message: `Bienvenue, ${req.user.username}` });
});

module.exports = router;
