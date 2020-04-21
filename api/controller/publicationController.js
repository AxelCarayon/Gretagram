const Publication = require('../model/publicationModel');
const Hashtag = require('../model/hashtagModel');
const User = require('../model/userModel')
const authenticateToken = require('./loginController').authenticateToken;
const http = require('http');
const querystring = require('querystring');
var url = "";

//renvoie la liste de tous les # dans le texte donné
function findHashtags(searchText) {
    let regexp = /\B\#\w\w+\b/g
    let result = searchText.match(regexp);
    return result;
}

async function hashtagExists(hashtag) {
    let query = Hashtag.findOne({ 'name': hashtag });
    return new Promise(function(resolve, reject) {
        query.exec((err, hashtag) => {
            if (err) {
                return reject(err);
            }
            resolve(hashtag);
        });
    });
}

//on regarde les hashtags à créer/modifier
async function sendHashtags(hashtags, token, publicationID) {
    let options = { // les options de la requête AJAX
        hostname: "localhost",
        port: 8080,
        path: '/api/hashtag',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 0
        }
    };
    //pour chaque hashtag
    for (const hashtag of(hashtags)) {
        let postData = querystring.stringify({ // on prépare le body de la requête
            'name': hashtag,
            'publicationID': publicationID + "",
            'token': token
        });
        options.headers["Content-Length"] = postData.length;

        let rep = await hashtagExists(hashtag);
        if (rep != null) {
            options.method = 'PATCH'; // on modifie le # si il existe déjà
        } else {
            options.method = 'POST'; // on crée le # si il n'existe pas
        }
        let req = http.request(options, (res) => {
            //console.log('statusCode:', res.statusCode);
            //console.log('headers:', res.headers);

            res.on('data', (d) => {
                //process.stdout.write(d);
            });
        });
        req.on('error', (e) => {
            console.error(e);
        });
        req.write(postData);
        req.end();
    };
}

// affiche une publication
exports.view = function(req, res) {
    Publication.findOne({ '_id': req.query.id }, function(err, publication) {
        if (err) {
            res.send(err);
        }
        if (publication) {
            res.send(publication);
        } else {
            res.send("aucune publication");
        }
    });
};

exports.all = function(req, res) {
    Publication.find({ 'userID': req.query.id }, function(err, publication) {
        if (err) {
            res.send(err);
        }
        if (publication) {
            res.send(publication);
        } else {
            res.send("aucune publication");
        }
    });
}

//affiche les publications des abonnés
exports.abonnes = function(req, res) {
    token = authenticateToken(req.body.token);
    if (token === null) {
        res.sendStatus(403);
    } else {
        User.findOne({ '_id': token._id }, function(err, user) {
            if (user.abonnements) {
                Publication.find({ userID: { $in: user.abonnements } }, function(err, publications) {
                    if (err) {
                        console.log(err);
                    }
                    res.json(publications);
                });
            }
        })
    }
}

//affiche les publications les plus populaires
exports.populaire = function(req, res) {
    if (req.query.size) {
        Publication.aggregate(
            [{
                    "$project": {
                        "date": 1,
                        "position": 1,
                        "photo": 1,
                        "message": 1,
                        "userID": 1,
                        "likes": 1,
                        "commentaires": 1,
                        "hashtag": 1,
                        "length": { "$size": "$likes" }
                    }
                },
                { "$sort": { "length": -1 } },
                { "$limit": parseInt(req.query.size) }
            ],
            function(err, results) {
                if (err) console.log(err);
                res.json(results);
            }
        )
    } else {
        Publication.aggregate(
            [{
                    "$project": {
                        "date": 1,
                        "position": 1,
                        "photo": 1,
                        "message": 1,
                        "userID": 1,
                        "likes": 1,
                        "commentaires": 1,
                        "hashtag": 1,
                        "length": { "$size": "$likes" }
                    }
                },
                { "$sort": { "length": -1 } }
            ],
            function(err, results) {
                if (err) console.log(err);
                res.json(results);
            }
        )
    }
}

// crée une nouvelle publication
exports.new = function(req, res) {
    url = req.get('host');
    let hashtags = []
    token = authenticateToken(req.body.token);
    if (token === null) {
        res.sendStatus(403);
    } else {
        var publication = new Publication();
        for (const [key, value] of Object.entries(req.body)) {
            publication[key] = value;
        }
        if (req.body.message != null) {
            hashtags = findHashtags(req.body.message);
        }
        publication.date = new Date();
        publication.userID = token._id;
        publication.hashtag = hashtags;
        publication.userName = token.prenom + " " + token.nom

        User.findOne({ '_id': token._id }, function(err, user) {
            if (err) {
                res.send(err);
            }
            user.publications.push(publication._id);
            user.save(function(err) {
                if (err) {
                    console.log(err);
                }
            });
        });

        publication.save(function(err) {
            if (err) {
                res.json(err);
            } else {
                //si on as des hashtags
                if (hashtags) {
                    sendHashtags(hashtags, req.body.token, publication._id);
                }
                res.json({
                    message: 'New publication crated!',
                    data: publication,
                    hashtags: hashtags
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
        Publication.deleteOne({ '_id': req.body.id }, function(err, publication) {
            if (token._id === publication.userID) {
                if (err) {
                    res.send(err);
                } else {
                    User.findOne({ '_id': token._id }, function(err, user) {
                        if (err) {
                            console.log(err);
                        } else {
                            const index = user.publications.findIndex(x => x._id == req.body.id);
                            user.publications.splice(index, 1);
                            user.save(function(err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.send({
                                        message: 'Publication deleted'
                                    });
                                }
                            })
                        }
                    });
                }
            } else {
                console.log("tentative de supprimer un post qui ne lui appartient pas");
                res.sendStatus(403);
            }
        });
    };
};