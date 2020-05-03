const readline = require('readline');
const faker = require('faker');
const User = require('../api/model/userModel');
const Publication = require('../api/model/publicationModel');
const Hashtag = require('../api/model/hashtagModel');
const mongoose = require('mongoose');
const cliProgress = require('cli-progress');
const fs = require('fs');
const request = require('request');
const uuidv4 = require("uuid/v4");
require('dotenv').config();

//Fonctions auxiliaires=======================================================================
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function is_numeric(str) {
    return /^\d+$/.test(str);
}

async function download(size, filename) {
    return new Promise(resolve => {
        request.head("https://picsum.photos/" + size, function(err, res, body) {
            request('https://picsum.photos/' + size).pipe(fs.createWriteStream(filename)).on('close', () => {
                resolve();
            });
        });
    });
};
//============================================================================================

//Fonctions principales=======================================================================

//Crée un utilisateur
function newUser(write) {
    let nom = faker.name.firstName();
    let prenom = faker.name.lastName();
    let date = faker.date.past();
    let email = faker.internet.email();
    let gender;
    if (getRandomInt(2) == 1) {
        gender = "male";
    } else {
        gender = "female";
    }
    let password = faker.internet.password();
    if (write) {
        fs.appendFile('login.txt', email + " : " + password + '\n', function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
    return {
        'nom': nom,
        'prenom': prenom,
        'email': email,
        'password': password,
        'gender': gender,
        'age': date.getFullYear() + "-" + ("0" + (1 + getRandomInt(12))).slice(-2) + "-" + ("0" + (1 + getRandomInt(28))).slice(-2)
    };
}

//Crée plusieurs utilisateurs
async function genUsers(nbr, write, size) {
    let users = [];
    let cpt = 0;
    fs.writeFile("login.txt", "username : password\n", function(err) {
        if (err) {
            console.log(err);
        }
    });
    return new Promise(async resolve => {
        for (let i = 0; i < nbr; i++) {
            user = newUser(write);

            let userRequest = new User();
            userRequest.nom = user.nom;
            userRequest.prenom = user.prenom;
            userRequest.gender = user.gender;
            userRequest.email = user.email;
            userRequest.password = userRequest.generateHash(user.password);
            userRequest.age = new Date(user.age);
            await download(size, "photo.jpg");
            let id = uuidv4() + ".jpg";
            fs.rename('photo.jpg', '../photos/' + id, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            userRequest.pp = id;
            userRequest.photos = [id];
            userRequest.save(async function(err) {
                if (err) {
                    console.log("info : le mail " + user.email + " est déja utilisé, l'utilisateur n'as pas été ajouté");
                } else {
                    cpt++;
                    users.push(userRequest);
                    if (cpt == nbr) {
                        resolve(users);
                    }
                }
            });
            usersProgress.increment();
        }
    });
}

//Crée les publications
async function genPublications(nbr, users, size) {
    let cpt = 0;
    let publications = [];
    return new Promise(async resolve => {
        if (nbr < 1) {
            resolve();
        }
        for (let i = 0; i < nbr; i++) {
            let index = getRandomInt(users.length);
            let publication = new Publication();
            publication.date = new Date();
            publication.userID = users[index]._id;
            publication.userName = users[index].prenom + " " + users[index].nom;
            publication.message = "Ceci est la publication numéro " + i + " par " + users[index].prenom + " " + users[index].nom;
            publication.position = { lat: faker.address.latitude(), long: faker.address.longitude() };
            await download(size, "photo.jpg");
            let id = uuidv4() + ".jpg";
            fs.rename('photo.jpg', '../photos/' + id, (err) => {
                if (err) {
                    console.log(err);
                }
            });

            User.findOne({ '_id': users[index]._id }, function(err, user) {
                if (err) {
                    console.log(err);
                }
                if (user.publications) {
                    user.publications.push(publication._id);
                } else {
                    user.publications = [publication._id];
                }
                user.save((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            });

            publication.photo = id;
            publicationsProgress.increment();
            publication.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    cpt++;
                    publications.push(publication._id);
                    if (cpt == nbr) {
                        resolve(publications);
                    }
                }
            });
        }
    });
}

//Ajoute les commentaires
async function genLikes(nbr, publications, users) {
    let cpt = 0;
    return new Promise(async resolve => {
        if (nbr < 1) {
            resolve();
        }
        for (let i = 0; i < nbr; i++) {
            let indexPublication = getRandomInt(publications.length);
            let indexUsers = getRandomInt(users.length);
            Publication.findOne({ '_id': publications[indexPublication]._id }, function(err, publication) {
                if (err) {
                    console.log(err);
                }
                if (publication.likes) {
                    const index = publication.likes.findIndex(x => x._id == users[indexUsers]._id);
                    if (index != -1) {
                        publication.likes.splice(index, 1);
                    } else {
                        publication.likes.push(users[indexUsers]._id);
                    }
                } else {
                    publication.likes = [users[indexUsers]._id];
                }
                likeProgress.increment();
                publication.save(function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        cpt++;
                        publications.push(publication._id);
                        if (cpt == nbr) {
                            resolve();
                        }
                    }
                });
            });
        }
    });
}

//Ajouter un commentaire
async function genComments(nbr, publications, users) {
    let cpt = 0;
    return new Promise(async resolve => {
        if (nbr < 1) {
            resolve();
        }
        for (let i = 0; i < nbr; i++) {
            let indexPublication = getRandomInt(publications.length);
            let indexUsers = getRandomInt(users.length);
            Publication.findOne({ '_id': publications[indexPublication]._id }, function(err, publication) {
                if (err) {
                    console.log(err);
                }
                if (publication.commentaires) {
                    publication.commentaires.push({
                        userID: users[indexUsers]._id,
                        message: "ceci est le commentaire numéro " + i + " de " + users[indexUsers].prenom + " " + users[indexUsers].nom,
                        date: new Date()
                    });
                } else {
                    publication.commentaires = [{
                        userID: users[indexUsers]._id,
                        message: "ceci est le commentaire numéro " + i + " de " + users[indexUsers].prenom + " " + users[indexUsers].nom,
                        date: new Date()
                    }];
                }
                commentsProgress.increment();
                publication.save(function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        cpt++;
                        publications.push(publication._id);
                        if (cpt == nbr) {
                            resolve();
                        }
                    }
                });
            });
        }
    });
}


async function lancerTest(nbUtilisateurs, nbPublications, nbCommentaires, nbLikes, write, sizePublication, sizePP) {
    //utilisateurs
    console.log("Génération des utilisateurs en cours");
    usersProgress.start(nbUtilisateurs, 0, {
        speed: "N/A"
    });
    let users = await genUsers(nbUtilisateurs, write, sizePP);
    usersProgress.stop();

    //publications
    console.log("Génération des publications en cours");
    publicationsProgress.start(nbPublications, 0, {
        speed: "N/A"
    });
    let publications = await genPublications(nbPublications, users, sizePublication);
    publicationsProgress.stop();

    //commentaires
    console.log("Génération des commentaires en cours");
    commentsProgress.start(nbPublications, 0, {
        speed: "N/A"
    });
    await genComments(nbCommentaires, publications, users);
    commentsProgress.stop();

    //likes
    console.log("Génération des likes en cours");
    likeProgress.start(nbLikes, 0, {
        speed: "N/A"
    });
    await genLikes(nbLikes, publications, users);
    likeProgress.stop();

    //on ferme la connection à la BDD
    mongoose.connection.close();
}












const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Ce programme permet de peupler la base de données de Gretagram avec les données entrées");

let lancerQuestions0 = function() {
    r1.question("Combien d'utilisateurs à générer ?\n", function(answer) {
        if (is_numeric(answer)) {
            lancerQuestions1(answer);
        } else {
            console.log("erreur : le nombre d'utilisateurs doit être un chiffre");
            lancerQuestions0();
        }
    });
};

let lancerQuestions1 = function(nbUtilisateurs) {
    r1.question('Combien de publications à générer ?\n', function(answer) {
        if (is_numeric(answer)) {
            lancerQuestions2(nbUtilisateurs, answer);
        } else {
            console.log("erreur : le nombre de publications doit être un chiffre");
            lancerQuestions1(nbUtilisateurs);
        }
    });
};

let lancerQuestions2 = function(nbUtilisateurs, nbPublications) {
    r1.question('Combien de commentaires à générer ?\n', function(answer) {
        if (is_numeric(answer)) {
            lancerQuestions3(nbUtilisateurs, nbPublications, answer);
        } else {
            console.log("erreur : le nombre de commentaires doit être un chiffre");
            lancerQuestions2(nbUtilisateurs, nbPublications);
        }
    });
};

let lancerQuestions3 = function(nbUtilisateurs, nbPublications, nbCommentaires) {
    r1.question('Combien de likes à générer ?\n', function(answer) {
        if (is_numeric(answer)) {
            lancerQuestions4(nbUtilisateurs, nbPublications, nbCommentaires, answer);
        } else {
            console.log("erreur : le nombre de likes doit être un chiffre");
            lancerQuestions3(nbUtilisateurs, nbPublications, nbCommentaires);
        }
    });
}

let lancerQuestions4 = function(nbUtilisateurs, nbPublications, nbCommentaires, nbLikes) {
    r1.question('Sauvegarder les username et mot de passe dans un fichier "login.txt" ? (o/n)\n', function(answer) {
        if (answer === "o" || answer === "n") {
            if (answer === "o") {
                lancerQuestions5(nbUtilisateurs, nbPublications, nbCommentaires, nbLikes, true);
            } else {
                lancerQuestions5(nbUtilisateurs, nbPublications, nbCommentaires, nbLikes, false);
            }
        } else {
            console.log("erreur : réponse o(oui) ou n(non) attendue");
            lancerQuestions4(nbUtilisateurs, nbPublications, nbCommentaires, nbLikes);
        }
    });
}

let lancerQuestions5 = function(nbUtilisateurs, nbPublications, nbCommentaires, nbLikes, write) {
    r1.question('Quelle taille (en pixels) pour les photos des publications ?\n', function(answer) {
        if (is_numeric(answer)) {
            lancerQuestions6(nbUtilisateurs, nbPublications, nbCommentaires, nbLikes, write, answer);
        } else {
            console.log("erreur : la taille doit être un chiffre");
            lancerQuestions5(nbUtilisateurs, nbPublications, nbCommentaires, nbLikes, write);
        }
    });
}

let lancerQuestions6 = function(nbUtilisateurs, nbPublications, nbCommentaires, nbLikes, write, sizePublication) {
    r1.question('Quelle taille (en pixels) pour les photos de profil?\n', function(answer) {
        if (is_numeric(answer)) {
            lancerTest(nbUtilisateurs, nbPublications, nbCommentaires, nbLikes, write, sizePublication, answer);
            return r1.close();
        } else {
            console.log("erreur : la taille doit être un chiffre");
            lancerQuestions6(nbUtilisateurs, nbPublications, nbCommentaires, nbLikes, write, sizePublication);
        }
    });
}


const usersProgress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const publicationsProgress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const likeProgress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const commentsProgress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

mongoose.connect('mongodb://localhost/gretagram', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

lancerQuestions0();