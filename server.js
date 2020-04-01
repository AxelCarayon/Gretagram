//DEPENDANCES========================================================
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const app = express();
const path = require('path');
const mongoose = require('mongoose'); // Configure bodyparser to handle post requests
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var fileupload = require("express-fileupload");
app.use(fileupload());
//===================================================================

require('dotenv').config();
app.use(express.static(__dirname + '/public'));

// Import Body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json()); // Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/gretagram', { useNewUrlParser: true, useUnifiedTopology: true });


// Import routes
let apiRoutes = require("./api/api-routes") // Use Api routes in the App
app.use('/api', apiRoutes);

//==============================================================================================

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/View/index.html'));
});
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/View/login.html'));
});
app.get('/createUser', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/View/createUser.html'));
});
app.get('/profil', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/View/profil.html'));
});

app.post('/connect', function(req, res) {
    var username = req.body.username; // Le nom d'utilisateur et le mot de passe sont récupérés ici
    var password = req.body.password; // Pour les tester ensuite

    console.log(`username : ${username}`);
    console.log(`password : ${password}`);


});

app.get('*', function(req, res) {
    res.status(404).send("eh gros nul 202 + 202 ça fait combien mdr bah ouais 404 comme ton erreur mon pote ahahah quel looser il sait même pas taper comme il faut une URL");
});

app.listen(8080, function() {
    console.log('Serveur lancé sur le port 8080');
    console.log('Répertoire du serveur : ' + __dirname);
});