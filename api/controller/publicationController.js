const Publication = require('../model/publicationModel');
const authenticateToken = require('./loginController').authenticateToken;

// affiche une publication
exports.view = function(req, res) {
    Publication.findOne({ '_id': req.body.id }, function(err, publication) {
        if (err) {
            res.send(err);
        }
        res.send(publication);
    });
};

// crée une nouvelle publication
exports.new = function(req, res) {
    token = authenticateToken(req.body.token);
    if (token === null) {
        res.sendStatus(403);
    } else {
        var publication = new Publication();
        for (const [key, value] of Object.entries(req.body)) {
            publication[key] = value;
        }
        publication.date = new Date();
        publication.userID = token._id;

        publication.save(function(err) {
            if (err) {
                res.json(err);
            } else {
                res.json({
                    message: 'New publication crated!',
                    data: publication
                });
            };
        });
    };
};


// met à jour une publication
exports.update = function(req, res) {
    token = authenticateToken(req.body.token);
    if (token === null) {
        res.sendStatus(403);
    } else {
        Publication.findById(req.body.id, function(err, publication) {
            if (err)
                res.send(err);
            try {
                if (token._id === publication.userID) {
                    for (const [key, value] of Object.entries(req.body)) {
                        if (key != "token") {
                            publication[key] = value;
                        }
                    }
                    publication.save(function(err) {
                        if (err)
                            res.json(err);
                        else {
                            res.json({
                                message: 'Publication updated',
                                data: publication
                            });
                        }
                    });
                } else {
                    console.log("tentative de modifier un post qui ne lui appartient pas");
                    res.sendStatus(403);
                }
            } catch (err) {
                res.sendStatus(500);
                console.log(err);
            }
        });
    }
};

// supprime une publication
exports.delete = function(req, res) {
    token = authenticateToken(req.body.token)
    if (token === null) {
        res.sendStatus(403);
    } else {
        Publication.deleteOne({ '_id': token._id }, function(err, publication) {
            if (token._id === publication.userID) {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: 'Publication deleted'
                    });
                }
            } else {
                console.log("tentative de supprimer un post qui ne lui appartient pas");
                res.sendStatus(403);
            }
        });
    };
};