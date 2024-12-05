const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const credentialSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: true },
  clientSecret: { type: String, required: true },
  clientName: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now }
});

// Middleware pour hasher le clientSecret avant sauvegarde
credentialSchema.pre('save', async function (next) {
  if (!this.isModified('clientSecret')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.clientSecret = await bcrypt.hash(this.clientSecret, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Credential', credentialSchema);
