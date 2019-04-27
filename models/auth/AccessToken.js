const mongoose = require('mongoose');
// OAuth2 Access Token Schema
const accessTokenSchema = new mongoose.Schema({
    tokenType: { type: String, required: true }, // "Bearer"
    accessToken: { type: String, required: true }, // expires every 30 minutes
    accessTokenExpiresInSeconds: { type: Number, required: true }, // seconds to expire
    accessTokenGrantedDate: { type: Date, required: true }, // date time access token was granted
    accessTokenExpirationDate: { type: Date, required: true } // date time access token will expire (granted date + expires in)
});
module.exports = mongoose.model('AccessToken', accessTokenSchema);