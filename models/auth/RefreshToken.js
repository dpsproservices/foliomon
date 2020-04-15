const mongoose = require('mongoose');
// OAuth2 Refresh Token Schema
const refreshTokenSchema = new mongoose.Schema({
    tokenType: { type: String, required: true }, // "Bearer"
    refreshToken: { type: String, required: true }, // expires every 90 days
    refreshTokenExpiresInSeconds: { type: Number, required: true }, // seconds to expire
    refreshTokenGrantedDate: { type: Date, required: true }, // date time refresh token was granted
    refreshTokenExpirationDate: { type: Date, required: true } // date time refresh token will expire (granted date + expires in)
}, { timestamps: true });
module.exports = mongoose.model('RefreshToken', refreshTokenSchema);