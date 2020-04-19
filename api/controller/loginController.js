const User = require('../model/userModel'); // Handle index actions
const jwt = require('jsonwebtoken');

//vérifie si un token est correct ou non
exports.authenticateToken = function authenticateToken(token) {
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
    let username = req.query.username;
    let password = req.query.password;
    User.findOne({ 'email': username }, function(err, user) {
        if (err) {
            res.send(err);
        } else if (!user) {
            res.sendStatus(406); //pas d'utilisateur
        } else if (!user.validPassword(password)) {
            res.sendStatus(406); //pas le bon mot de passe
        } else {
            const accesstoken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
            res.send({'token':accesstoken,'id':user._id});
            //console.log(user);
        }

    })
};