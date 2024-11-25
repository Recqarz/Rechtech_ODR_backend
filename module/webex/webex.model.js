const mongoose = require('mongoose');

const globalTokenSchema = new mongoose.Schema({
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

const GlobalToken = mongoose.model('GlobalToken', globalTokenSchema);

module.exports = GlobalToken;
