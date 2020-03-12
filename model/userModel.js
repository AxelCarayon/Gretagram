// userModel.js
var mongoose = require('mongoose'); // Setup schema
var userSchema = mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: String,
    age: Date,
    pp: String,
    photos: [{ path: String }]
});
// Export User model
var User = module.exports = mongoose.model('user', userSchema);
module.exports.get = function(callback, limit) {
    User.find(callback).limit(limit);
}