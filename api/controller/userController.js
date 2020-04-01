const User = require('../model/userModel');
const authenticateToken = require('./loginController').authenticateToken;
var mkdirp = require('mkdirp');
var path = require('path');

// affiche un utilisateur
exports.view = function(req, res) {
    token = authenticateToken(req.body.token)
    if (token === null) {
        res.sendStatus(403);
    } else {
        User.findOne({ '_id': token._id }, function(err, user) {
            if (err) {
                res.send(err);
            }
            res.send(user);
        });
    }
};

// crée un nouvel utilisateur 
exports.new = function(req, res) {
    var user = new User();
    user.nom = req.body.nom;
    user.prenom = req.body.prenom;
    user.gender = req.body.gender;
    user.email = req.body.email;
    user.password = user.generateHash(req.body.password);
    user.age = new Date(req.body.age);
    user.photos = [];
    user.pp = null;
    chemin = path.join(path.dirname(path.dirname(__dirname)), 'photos', user._id.toString());
    mkdirp(chemin).then(made =>
        console.log(`folder created : ${made}`));

    user.save(function(err) {
        if (err)
            res.json(err);
        res.json({
            message: 'New user created!',
            data: user
        });
    });
};


// met à jour un utilisateur
exports.update = function(req, res) {
    token = authenticateToken(req.body.token)
    if (token === null) {
        res.sendStatus(403);
    } else {
        User.findById(token._id, function(err, user) {
            if (err)
                res.send(err);
            try {
                for (const [key, value] of Object.entries(req.body)) {
                    if (key === "password") {
                        user.password = user.generateHash(value);
                    } else {
                        user[key] = value;
                    }
                }
                user.save(function(err) {
                    if (err)
                        res.json(err);
                    else {
                        res.json({
                            message: 'User Info updated',
                            data: user
                        });
                    }
                });
            } catch (err) {
                res.sendStatus(500);
                console.log(err);
            }
        });
    }
};

// supprime un utilisateur
exports.delete = function(req, res) {
    token = authenticateToken(req.body.token)
    if (token === null) {
        res.sendStatus(403);
    } else {
        User.deleteOne({ '_id': token._id }, function(err, user) {
            if (err) {
                res.send(err);
            } else {
                res.send({
                    message: 'User deleted'
                });
            }
        });
    };
};