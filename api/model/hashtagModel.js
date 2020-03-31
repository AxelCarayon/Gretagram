var mongoose = require('mongoose');

var HashtagSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    l_Publications: [],
    nbr: Number

});

// Export Publication model
var Hashtag = module.exports = mongoose.model('hashtag', HashtagSchema);
module.exports.get = function(callback, limit) {
    Hashtag.find(callback).limit(limit);
}