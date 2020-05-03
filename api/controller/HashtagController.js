const Hashtag = require('../model/hashtagModel');
const authenticateToken = require('./loginController').authenticateToken;

// affiche un hashtag
exports.view = function(req, res) {
    Hashtag.findOne({ '_id': req.query.id }, function(err, hashtag) {
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
        hashtag.l_publications = [req.body.publicationID];
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
        Hashtag.findOne({ 'name': req.body.name }, function(err, hashtag) {
            if (err) {
                res.status(500).send(err);
            }
            try {
                //liste = hashtag.l_publications.push(req.body.publicationID);
                hashtag.l_publications.push(req.body.publicationID);
                hashtag.save(function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json({
                            message: 'Hashtag updated',
                            data: hashtag
                        });
                    }
                });
            } catch (err) {
                console.log(err)
                    //res.status(500).send(err);
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

exports.search = (req, res) => {
    Hashtag.findOne({ name: req.query.hashtag }, (err, hashtag) => {
        if (hashtag) {
            res.json({
                status: "hashtag trouvé",
                data: hashtag
            });
        } else {
            res.send({ status: "hashtag inexistant" });
        }
    });
}