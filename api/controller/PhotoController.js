const User = require('../model/userModel');
const authenticateToken = require('./loginController').authenticateToken;
const path = require('path');
const fs = require('fs');
const uuidv4 = require("uuid/v4");

// affiche une photo
exports.view = function(req, res) {
    chemin = path.join(path.dirname(path.dirname(__dirname)), 'photos/', req.query.photo);
    res.sendFile(chemin);
};

// upload une nouvelle photo
exports.new = function(req, res) {
    token = authenticateToken(req.body.token)
    if (token === null) {
        res.sendStatus(403);
    } else {
        User.findOne({ '_id': token._id }, function(err, user) {
            if (err) {
                res.send(err);
            }

            try {
                if (!req.files || Object.keys(req.files).length === 0) {
                    return res.status(400).send('No files were uploaded.');
                }
                let photo = req.files.photo;
                let id = uuidv4() + path.extname(photo.name);
                photo.mv('./photos/' + id, function(err) {
                    if (err)
                        return res.status(500).send(err);
                    user.photos.push(id);
                    user.save(function(err) {
                        if (err)
                            res.json(err);
                        res.json({
                            message: 'Photo uploaded!',
                            data: user,
                            imgName: id
                        });
                    });
                });

            } catch (err) {
                console.log(err);
                res.status(500).send("erreur envoi fichier")
            }
        });
    }
};



// supprime une photo
exports.delete = function(req, res) {
    token = authenticateToken(req.body.token)
    if (token === null) {
        res.sendStatus(403);
    } else {
        User.findOne({ '_id': token._id }, function(err, user) {
            if (err) {
                res.send(err);
            }

            for ([key, value] of Object.entries(user.photos)) {
                if (value === req.body.photo) {
                    user.photos.splice(key, 1);
                }
            }

            chemin = path.join(path.dirname(path.dirname(__dirname)), 'photos/', req.body.photo);
            try {
                fs.unlinkSync(chemin);
            } catch (err) {
                console.error(err);
            }

            user.save(function(err) {
                if (err)
                    res.json(err);
                res.json({
                    message: 'Photo deleted!',
                    data: user
                });
            });

        });
    };
};

exports.update = function(req, res) {
    token = authenticateToken(req.body.token)
    if (token === null) {
        res.sendStatus(403);
    } else {
        User.findOne({ '_id': token._id }, function(err, user) {
            if (err) {
                res.send(err);
            }
            if (user.photos.includes(req.body.photo)) {
                user.pp = req.body.photo
                user.save(function(err) {
                    if (err)
                        res.json(err);
                    res.json({
                        message: 'Profile picture set!',
                        data: user
                    });
                });
            } else {
                res.status(403).send("cette photo n'appartient pas à l'utilisateur.");
            }

        });
    }
}