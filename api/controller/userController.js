const User = require('../model/userModel');
const authenticateToken = require('./loginController').authenticateToken;
var path = require('path');

// affiche un utilisateur
exports.view = function(req, res) {
    User.findOne({ '_id': req.query.id }, function(err, user) {
        if (err) {
            res.send(err);
        }
        if (user) {
            res.json({
                nom: user.nom,
                prenom: user.prenom,
                pp: user.pp,
                photos: user.photos,
                publications: user.publications,
                abonnements: user.abonnements,
                abonnes: user.abonnes
            })
        } else {
            res.send("utilisateur inexistant");
        }
    });
};

//affiche toutes les infos d'un utlisateur si il as un token valide
exports.private = function(req, res) {
    token = authenticateToken(req.query.token)
    if (token === null) {
        res.sendStatus(403);
    } else {
        User.findOne({ '_id': token._id }, function(err, user) {
            if (err) {
                res.send(err);
            }
            if (user) {
                res.json({
                    data: user
                })
            } else {
                res.send("utilisateur inexistant");
            }
        });
    }
}

// crée un nouvel utilisateur 
exports.new = function(req, res) {
    var user = new User();
    user.nom = req.body.nom;
    user.prenom = req.body.prenom;
    user.gender = req.body.gender;
    user.email = req.body.email;
    user.password = user.generateHash(req.body.password);
    if (req.body.age) {
        user.age = new Date(req.body.age);
    }
    user.photos = [];
    user.pp = null;
    if (!req.body.nom || !req.body.prenom || !req.body.email || !req.body.password) {
        res.status(400).send("Toutes les données requises n'ont pas été entrées.");
    } else {
        User.findOne({ 'email': req.body.email }, function(err, foundUser) {
            let message = "New user created!";
            let data = null;
            if (foundUser) {
                message = "l'adresse mail est déjà utilisée";
            } else {
                user.save(function(err) {
                    if (err)
                        console.log(err);
                });
                data = user;
            }
            res.json({
                message: message,
                data: data
            });
        });
    }
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

exports.subscribe = function(req, res) {
    token = authenticateToken(req.body.token);
    if (token === null) {
        res.sendStatus(403);
    } else {
        let status = "";
        User.findOne({ '_id': req.body.id }, function(err, user) {
            User.findOne({ '_id': token._id }, function(err, nouvelAbonne) {
                if (!user) {
                    res.send("Oh Marie tu t'es encore trompé en collant l'ID");
                } else {
                    const index = nouvelAbonne.abonnements.findIndex(x => x._id == req.body.id);
                    if (index != -1) {
                        const index2 = user.abonnements.findIndex(x => x._id == token._id);
                        nouvelAbonne.abonnements.splice(index, 1);
                        user.abonnes.splice(index2, 1);
                        status = "abonnement supprimé";
                    } else {
                        nouvelAbonne.abonnements.push(user._id);
                        user.abonnes.push(token._id);
                        status = "abonnement ajouté";
                    }
                    user.save(function(err) {
                        if (err) {
                            res.json(err);
                        }
                    });
                    nouvelAbonne.save(function(err) {
                        if (err) {
                            res.json(err);
                        }
                    });
                    res.json({
                        status: status
                    });
                }
            });
        });
    }
}