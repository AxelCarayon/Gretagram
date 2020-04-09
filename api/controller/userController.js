const User = require('../model/userModel');
const authenticateToken = require('./loginController').authenticateToken;
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

    User.findOne({ 'email': req.body.email }, function(err, foundUser) {
        let message = "New user created!";
        let data = null;
        if (foundUser) {
            message = "l'adresse mail est déjà utilisée";
        } else {
            data = user;
        }
        user.save(function(err) {
            if (err)
                res.json(err);
            res.json({
                message: message,
                data: data
            });
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