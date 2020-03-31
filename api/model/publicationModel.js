var mongoose = require('mongoose');

var publicationSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    position: {
        lat: Number,
        long: Number
    },
    photo: String,
    message: String,
    userID: String,
    likes: [{ userID: String }],
    commentaires: [{ message: String }],
    hashtag: []
});

// Export Publication model
var Publication = module.exports = mongoose.model('publication', publicationSchema);
module.exports.get = function(callback, limit) {
    Publication.find(callback).limit(limit);
}