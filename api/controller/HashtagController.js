const Hashtag = require('../model/hashtagModel');
const authenticateToken = require('./loginController').authenticateToken;

// affiche un hashtag
exports.view = function(req, res) {
    Hashtag.findOne({ '_id': req.body.id }, function(err, hashtag) {
        if (err) {
            res.send(err);
        }
        res.send(hashtag);
    });
};

// crée un hashtag
exports.new = function(req, res) {
    token = req.body.token;
    userToken = authenticateToken(token);
    if (userToken === null) {
        res.sendStatus(403);
    } else {
        var hashtag = new Hashtag();
        hashtag.name = req.body.name;
        hashtag.nbr = 0;

        hashtag.save(function(err) {
            if (err) {
                res.json(err);
            } else {
                res.json({
                    message: "New Hashtag created!",
                    data: hashtag
                });
            };
        });
    };
};


// met à jour un hashtag
exports.update = function(req, res) {
    token = req.body.token;
    userToken = authenticateToken(token);
    if (userToken === null) {
        res.sendStatus(403);
    } else {
        Hashtag.findById(req.body.id, function(err, hashtag) {
            if (err) {
                res.status(500).send(err);
            }
            try {
                hashtag.nbr++;
                liste = hashtag.l_publications;
                hashtag.l_Publications.push(userToken._id);
                hashtag.save(function(err) {
                    if (err) {
                        res.status(500).send(json(err));
                    } else {
                        res.json({
                            message: 'Hashtag updated',
                            data: hashtag
                        });
                    }
                });
            } catch (err) {
                console.log(err)
                res.status(500).send(err);
            }
        });
    };
};

// supprime un hashtag
exports.delete = function(req, res) {
    hash = Hashtag.findOne({ '_id': req.body.id }, function(err, hashtag) {
        if (err) {
            res.send(err);
        }
        return hashtag;
    });
    if (hash.nbr != 0) {
        res.status(403).send("impossible de supprimer le #");
    } else {
        Hashtag.deleteOne({ '_id': req.body.id }, function(err, hashtag) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send({
                    message: 'Hashtag deleted'
                });
            }
        });
    }
};