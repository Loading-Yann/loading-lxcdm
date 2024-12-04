const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  clientSecret: { type: String, required: true },
  clientName: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Credential', credentialSchema);
