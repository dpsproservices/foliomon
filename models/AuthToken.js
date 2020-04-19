const mongoose = require('mongoose');
// OAuth2 Access and Refresh Token Schema
const authTokenSchema = new mongoose.Schema({
    tokenType: { type: String, required: true }, // "Bearer"
    accessToken: { type: String, required: true }, // expires every 30 minutes
    accessTokenExpiresInSeconds: { type: Number, required: true }, // seconds to expire
    accessTokenGrantedDate: { type: Date, required: true }, // date time access token was granted
    accessTokenExpirationDate: { type: Date, required: true }, // date time access token will expire (granted date + expires in)
    refreshToken: { type: String, required: true }, // expires every 90 days
    refreshTokenExpiresInSeconds: { type: Number, required: true }, // seconds to expire
    refreshTokenGrantedDate: { type: Date, required: true }, // date time refresh token was granted
    refreshTokenExpirationDate: { type: Date, required: true }
}, { timestamps: true });
module.exports = mongoose.model('AuthToken', authTokenSchema);