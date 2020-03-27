const User = require('../model/userModel'); // Handle index actions
const jwt = require('jsonwebtoken');

//vérifie si un token est correct ou non
function authenticateToken(token) {
    // pas autorisé
    if (token == null) {
        console.log("token vide");
        return null;
    }

    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("token invalide");
            return null;
        }
        return user;
    });
}

// log un utilisateur
exports.login = function(req, res) {
    username = req.body.username;
    password = req.body.password;
    User.findOne({ 'email': username }, function(err, user) {
        if (err) {
            res.send(err);
        } else if (!user) {
            res.sendStatus(406); //pas d'utilisateur
        } else if (!user.validPassword(password)) {
            res.sendStatus(406); //pas le bon mot de passe
        } else {
            const accesstoken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
            res.send(accesstoken);
            //console.log(user);
        }

    })
};

// affiche un utilisateur
exports.view = function(req, res) {
    token = req.body.token;
    userToken = authenticateToken(token)
    if (userToken === null) {
        res.sendStatus(403);
    } else {
        User.findOne({ '_id': userToken._id }, function(err, user) {
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
    user.age = req.body.age;

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
    token = req.body.token;
    userToken = authenticateToken(token)
    if (userToken === null) {
        res.sendStatus(403);
    } else {
        User.findById(userToken._id, function(err, user) {
            if (err)
                res.send(err);
            try {
                user.nom = req.body.nom;
                user.prenom = req.body.prenom;
                user.gender = req.body.gender;
                user.email = req.body.email;
                user.password = user.generateHash(req.body.password);
                user.age = req.body.age;

                user.save(function(err) {
                    if (err)
                        res.json(err);
                    res.json({
                        message: 'User Info updated',
                        data: user
                    });
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
    token = req.body.token;
    userToken = authenticateToken(token)
    if (userToken === null) {
        res.sendStatus(403);
    } else {
        User.deleteOne({ '_id': userToken._id }, function(err, user) {
            if (err) {
                res.send(err);
            }
            res.send({
                message: 'User deleted'
            });
        });
    };
};