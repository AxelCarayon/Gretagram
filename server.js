const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/View/index.html'));
});

app.get('/testUser', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/tests/testsBDD.html'));
});

app.get('/showUser', function(req, res) {
    var userId = parseInt(req.query.user);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("gretagram");
        var query = { _id: userId };
        dbo.collection("users").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            res.send(result);
        });
    });
});

app.listen(8080, function() {
    console.log('Serveur lancé sur le port 8080');
    console.log('Répertoire du serveur : ' + __dirname);
});