const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/firewalls', (req, res) => {
  const filePath = path.join(__dirname, '../scripts/firewalls.json');
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    res.status(200).json(JSON.parse(data));
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

module.exports = router;
