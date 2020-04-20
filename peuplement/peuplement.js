const csv = require('csv-parser');
const fs = require('fs');
const querystring = require('querystring');
const http = require('http');
const readline = require('readline');
const { createCanvas } = require('canvas');
const faker = require('faker');

const fichier = 'MOCK_DATA.csv'

//Fonctions auxiliaires=======================================================================
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function is_numeric(str) {
    return /^\d+$/.test(str);
}

function createRandomImage(width, height, nbImg) {
    let cpt = 0;

    while (cpt < nbImg) {
        cpt++;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const stream = canvas.pngStream();
        const out = fs.createWriteStream(__dirname + '/image' + cpt + ".png");
        stream.on('data', function(chunk) {
            out.write(chunk); // On écrit le stream à un chemin précedemment défini
        });
        stream.on('end', function() {});
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                ctx.fillStyle = getRndColor(); // set random color
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
}

function getRndColor() {
    var r = 255 * Math.random() | 0,
        g = 255 * Math.random() | 0,
        b = 255 * Math.random() | 0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}
//============================================================================================

//Fonctions principales=======================================================================

//Crée un utilisateur
function newUser() {
    let nom = faker.name.firstName();
    let prenom = faker.name.lastName();
    let date = faker.date.past();
    let gender;
    if (getRandomInt(2) == 1) {
        gender = "male";
    } else {
        gender = "female";
    }
    let user = {
        'nom': nom,
        'prenom': prenom,
        'email': nom + "." + prenom + "@example.com",
        'password': faker.internet.password(),
        'gender': gender,
        'age': date.getFullYear() + "-" + ("0" + (1 + getRandomInt(12))).slice(-2) + "-" + ("0" + (1 + getRandomInt(28))).slice(-2)
    };
    return user;
}

//Crée plusieurs utilisateurs
function genUsers(nbr) {
    let users = [];
    let user = newUser();

    for (let i = 0; i < nbr; i++) {
        while (users.includes(user)) {
            user = newUser();
        }
        users.push(user);
    }
    return users;
}
//log chaque utilisateur et va chercher son username,password et un token
async function getTokens(users) {
    console.log("récupération des tokens sur le site ...");
    let tokens = [];
    let cpt = 0;
    let options = { // les options de la requête AJAX
        hostname: "localhost",
        port: 8080,
        path: '',
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 0
        }
    };
    return await new Promise(async resolve => {
        users.forEach(element => { //pour chaque utilisateur on va faire une requête 
            let postData = querystring.stringify({ //on ajoute dans le body de la requête les éléments de l'utilisateur
                'username': element.email,
                'password': element.password,
            });
            options.headers["Content-Length"] = postData.length;
            options.path = "/api/login?username=" + element.email + "&password=" + element.password;
            // on précise la requête
            let req = http.request(options, (res) => {
                res.on('data', (d) => { //quand le serveur nous renvoie des données
                    cpt++; //on incrémente un compteur à chaque fois qu'on as trouvé un élément
                    let user = {
                        'token': Buffer.from(d, 'binary').toString('utf8'),
                        'prenom': element.prenom,
                        'nom': element.nom,
                        'username': element.email
                    }
                    tokens.push(user);
                    if (cpt == users.length) { //si on as autant d'utlisateurs que dans le CSV on as fini les requêtes
                        console.log("fin de récupération des tokens")
                        resolve(tokens); // on résoud donc la requête en renvoyant la liste d'utilisateurs
                    }
                });
                req.on('error', (e) => { //si la requête envoie une erreur
                    console.error(e);
                });
            });
            req.write(postData); //on envoie la requête
            req.end(); //on termine la requête
        });
    });
};

//crée les utilisateurs dans la base de donnée
async function createUsers(users) {
    console.log("envoi des utilisateurs sur le site ...");
    return new Promise(async resolve => {
        let cpt = 0;
        let options = { // les options de la requête AJAX
            hostname: "localhost",
            port: 8080,
            path: '/api/user',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': 0
            }
        };
        users.forEach(element => {
            let postData = querystring.stringify({
                'nom': element.nom,
                'prenom': element.prenom,
                'email': element.email,
                'password': element.password,
                'gender': element.gender,
                'age': element.age
            });
            options.headers["Content-Length"] = postData.length;
            let req = http.request(options, (res) => {
                res.on('data', (d) => {
                    cpt++;
                    if (cpt == users.length) {
                        resolve(console.log("fin de création des utilisateurs"));
                    }
                });
            });
            req.on('error', (e) => {
                console.error(e);
            });
            req.write(postData);
            req.end();
        });
    });
};


async function createPublications(tokens, nbrPublication) {
    return new Promise(async resolve => {
        let options = { // les options de la requête AJAX
            hostname: "localhost",
            port: 8080,
            path: '/api/publication',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': 0
            }
        };
        let element = tokens[getRandomInt(tokens.length)];
        let message = "Ceci est la publication n°" + nbrPublication + " de " + element.prenom + " " + element.nom + " #test #zebi #oui";
        let postData = querystring.stringify({
            'token': element.token,
            'message': message
        });
        options.headers["Content-Length"] = postData.length;
        let req = http.request(options, (res) => {
            res.on('data', (d) => {
                let reponse = JSON.parse(Buffer.from(d, 'binary').toString('utf8'));
                resolve(reponse.data._id);
            });
        });
        req.on('error', (e) => {
            console.error(e);
        });
        req.write(postData);
        req.end();
    });
}


async function createComments(tokens, lPublications, nbrCommentaire) {
    return new Promise(async resolve => {
        let options = { // les options de la requête AJAX
            hostname: "localhost",
            port: 8080,
            path: '/api/publication/comment',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': 0
            }
        };
        let element = tokens[getRandomInt(tokens.length)];
        let id = lPublications[getRandomInt(lPublications.length)];
        let message = "Ceci est le commentaire n°" + nbrCommentaire + " de " + element.prenom + " " + element.nom + " #test #zebi #oui";
        let postData = querystring.stringify({
            'token': element.token,
            'message': message,
            'id': id
        });
        options.headers["Content-Length"] = postData.length;
        let req = http.request(options, (res) => {
            res.on('data', (d) => {
                resolve();
            });
        });
        req.on('error', (e) => {
            console.error(e);
        });
        req.write(postData);
        req.end();
    });
};

async function likePublications(tokens, lPublications) {
    return new Promise(async resolve => {
        let options = { // les options de la requête AJAX
            hostname: "localhost",
            port: 8080,
            path: '/api/publication/like',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': 0
            }
        };
        let element = tokens[getRandomInt(tokens.length)];
        let id = lPublications[getRandomInt(lPublications.length)];
        let postData = querystring.stringify({
            'token': element.token,
            'id': id
        });
        options.headers["Content-Length"] = postData.length;
        let req = http.request(options, (res) => {
            res.on('data', (d) => {
                resolve();
            });
        });
        req.on('error', (e) => {
            console.error(e);
        });
        req.write(postData);
        req.end();
    });
};

async function lancerTest(nbUtilisateurs, nbPublications, nbCommentaires, nbLikes) {
    console.log("génération des utilisateurs ...");
    const users = genUsers(nbUtilisateurs);
    console.log("fin de la génération des utilisateurs");
    await createUsers(users);
    const tokens = await getTokens(users);
    let cptPublications = 0;
    let cptCommentaires = 0;
    let cptLikes = 0;
    let lPublications = [];
    console.log("génération et envoi des publications sur le site ...");
    lPublications.push(await createPublications(tokens, cptPublications + 1));
    setTimeout(async() => {
        while (cptPublications < (nbPublications - 1)) {
            cptPublications++;
            lPublications.push(await createPublications(tokens, cptPublications + 1));
        }
        console.log("fin de l'envoi des publications");
        console.log("génération et envoi des commentaires sur le site ...");
        while (cptCommentaires < nbCommentaires) {
            cptCommentaires++;
            await createComments(tokens, lPublications, cptCommentaires);
        }
        console.log("fin de l'envoi des commentaires");
        console.log("envoi des likes sur le site ...");
        while (cptLikes < nbLikes) {
            cptLikes++;
            await likePublications(tokens, lPublications);
        }
        console.log("fin de l'envoi des likes");
        console.log("fin du peuplement de la base de données");
    }, 100);
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
            console.log("erreur : le nombre d'utilisateurs doit être un chiffre.");
            lancerQuestions0();
        }
    });
};

let lancerQuestions1 = function(nbUtilisateurs) {
    r1.question('Combien de publications à générer ?\n', function(answer) {
        if (is_numeric(answer)) {
            lancerQuestions2(nbUtilisateurs, answer);
        } else {
            console.log("erreur : le nombre de publications doit être un chiffre.");
            lancerQuestions1(nbUtilisateurs);
        }
    });
};

let lancerQuestions2 = function(nbUtilisateurs, nbPublications) {
    r1.question('Combien de commentaires à générer ?\n', function(answer) {
        if (is_numeric(answer)) {
            lancerQuestions3(nbUtilisateurs, nbPublications, answer);
        } else {
            console.log("erreur : le nombre de commentaires doit être un chiffre.");
            lancerQuestions2(nbUtilisateurs, nbPublications);
        }
    });
};

let lancerQuestions3 = function(nbUtilisateurs, nbPublications, nbCommentaires) {
    r1.question('Combien de likes à générer ?\n', function(answer) {
        if (is_numeric(answer)) {
            lancerTest(nbUtilisateurs, nbPublications, nbCommentaires, answer);
            return r1.close();
        } else {
            console.log("erreur : le nombre de commentaires doit être un chiffre.");
            lancerQuestions3(nbUtilisateurs, nbPublications, nbCommentaires);
        }
    });
}

lancerQuestions0();