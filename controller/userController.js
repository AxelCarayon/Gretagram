// Import user model
const User = require('../model/userModel'); // Handle index actions
const jwt = require('jsonwebtoken');

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

exports.login = function(req, res) {
    username = req.query.username;
    password = req.query.password;
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

exports.index = function(req, res) {
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
        })
    }
};

// Handle create user actions
exports.new = function(req, res) {
    var user = new User();
    user.nom = req.body.nom;
    user.prenom = req.body.prenom;
    user.gender = req.body.gender;
    user.email = req.body.email;
    user.password = user.generateHash(req.body.password);
    user.age = req.body.age;
    // save the user and check for errors
    user.save(function(err) {
        if (err)
            res.json(err);
        res.json({
            message: 'New user created!',
            data: user
        });
    });
};

// Handle view user info
exports.view = function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err)
            res.send(err);
        res.json({
            message: 'User details loading..',
            data: user
        });
    });

}; // Handle update user info
exports.update = function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err)
            res.send(err);
        user.nom = req.body.nom;
        user.prenom = req.body.prenom;
        user.gender = req.body.gender;
        user.email = req.body.email;
        user.password = req.body.password;
        user.age = req.body.age;
        // save the user and check for errors
        user.save(function(err) {
            if (err)
                res.json(err);
            res.json({
                message: 'User Info updated',
                data: user
            });
        });
    });
}; // Handle delete user
exports.delete = function(req, res) {
    User.remove({
        _id: req.params.user_id
    }, function(err, user) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'User deleted'
        });
    });
};