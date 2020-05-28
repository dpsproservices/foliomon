const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
// User
var userSchema = new mongoose.Schema({
    email: { type: String, index: true, unique: true, lowercase: true, required: true },
    password: { type: String, required: true },
    secret: { type: String, required: false }
}, { timestamps: true });

userSchema.plugin(uniqueValidator);

userSchema.methods.verifyPassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { 
            return callback(err); 
        }
        callback(null,isMatch);
    });
}

module.exports = mongoose.model('User', userSchema);