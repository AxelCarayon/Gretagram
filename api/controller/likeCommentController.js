const Publication = require('../model/publicationModel');
const authenticateToken = require('./loginController').authenticateToken;

//like/unlike publication
exports.like = function(req, res) {
    token = authenticateToken(req.body.token);
    if (token === null) {
        res.sendStatus(403);
    } else {
        Publication.findOne({ '_id': req.body.id }, function(err, publication) {
            let status = "";
            if (err) {
                res.send(err);
            }
            if (publication.likes) {
                const index = publication.likes.findIndex(x => x._id == token._id);
                if (index != -1) {
                    publication.likes.splice(index, 1);
                    status = "publication unlikée";
                } else {
                    publication.likes.push(token._id);
                    status = "publication likée";
                }
            } else {
                publication.likes = [token._id];
            }
            publication.save(function(err) {
                if (err) {
                    res.json(err);
                } else {
                    res.json({
                        status: status,
                        data: publication
                    });
                };
            });
        });
    }
};

//ajouter un commentaire
exports.new = function(req, res) {
    token = authenticateToken(req.body.token);
    if (token === null) {
        res.sendStatus(403);
    } else {
        Publication.findOne({ '_id': req.body.id }, function(err, publication) {
            if (err) {
                res.send(err);
            }
            if (publication.commentaires) {
                publication.commentaires.push({
                    userID: token._id,
                    message: req.body.message,
                    date: new Date()
                });
            } else {
                publication.commentaires = [{
                    userID: token._id,
                    message: req.body.message,
                    date: new Date()
                }];
            }
            publication.save(function(err) {
                if (err) {
                    res.json(err);
                } else {
                    res.json({
                        status: "commentaire envoyé",
                        data: publication
                    });
                };
            });
        });
    }
};

//affiche le nombre de likes et les personnes
exports.view = function(req, res) {
    Publication.findOne({ '_id': req.query.id }, function(err, publication) {
        if (err) {
            res.send(err);
        }
        if (publication.like) {
            res.send({
                "nombre de likes : ": publication.like.length,
                "personnes qui ont liké : ": publication.like
            });
        } else {
            res.send({
                status: "aucun like"
            });
        }
    });
};