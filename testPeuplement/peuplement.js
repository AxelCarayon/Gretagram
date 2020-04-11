const csv = require('csv-parser');
const fs = require('fs');
const querystring = require('querystring');
const http = require('http');
const readline = require('readline');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function is_numeric(str) {
    return /^\d+$/.test(str);
}

function readfile(file) {
    console.log("début de lecture des utilisateurs du fichier CSV")
    return new Promise(resolve => {
        let data = [];
        fs.createReadStream(file)
            .pipe(csv())
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                console.log('fin de lecture des utilisateurs dans le fichier CSV');
                resolve(data);
            });
    });
};
//log chaque utilisateur et va chercher son username,password et un token
async function getTokens() {
    console.log("début de création des tokens");
    let tokens = [];
    let cpt = 0;
    let options = { // les options de la requête AJAX
        hostname: "localhost",
        port: 8080,
        path: '/api/login',
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 0
        }
    };
    return await new Promise(async resolve => {
        const data = await readfile('MOCK_DATA.csv'); //on va chercher les utilisateurs dans le csv
        data.forEach(element => { //pour chaque utilisateur on va faire une requête 
            let postData = querystring.stringify({ //on ajoute dans le body de la requête les éléments de l'utilisateur
                'username': element.email,
                'password': element.password,
            });
            options.headers["Content-Length"] = postData.length;
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
                    if (cpt == data.length) { //si on as autant d'utlisateurs que dans le CSV on as fini les requêtes
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
async function createUsers() {
    return new Promise(async resolve => {
        console.log("début de la création des utilisateurs")
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
        const data = await readfile('MOCK_DATA.csv');
        data.forEach(element => {
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
                    if (cpt == data.length) {
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

async function lancerTest(nbPublications, nbCommentaires) {
    await createUsers();
    const tokens = await getTokens();
    let cptPublications = 0;
    let cptCommentaires = 0;
    console.log("début de création des publications");
    let lPublications = [];
    lPublications.push(await createPublications(tokens, cptPublications + 1));
    setTimeout(async() => {
        while (cptPublications < (nbPublications - 1)) {
            cptPublications++;
            lPublications.push(await createPublications(tokens, cptPublications + 1));
        }
        console.log(lPublications);
        console.log("fin de la création des publications");
        console.log("debut de création des commentaires");
        while (cptCommentaires < (nbCommentaires)) {
            cptCommentaires++;
            await createComments(tokens, lPublications, cptCommentaires);
        }
        console.log("fin de création des commentaires");

        console.log("fin du peuplement de la base de données")
    }, 100);

}


const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Ce programme génère automatiquement des utilisateurs d'après le fichier MOCK_DATA.csv puis crée des publications/commentaires réparti de façon aléatoire.");

var lancerQuestions1 = function() {
    r1.question('Combien de publications à générer ?\n', function(answer) {
        if (is_numeric(answer)) { //we need some base case, for recursion
            lancerQuestions2(answer);
        } else {
            console.log("erreur : le nombre de publications doit être un chiffre.");
            lancerQuestions1();
        }
    });
};

var lancerQuestions2 = function(nbPublications) {
    r1.question('Combien de commentaires à générer ?\n', function(answer) {
        if (is_numeric(answer)) { //we need some base case, for recursion
            lancerTest(nbPublications, answer);
            return r1.close();
        } else {
            console.log("erreur : le nombre de commentaires doit être un chiffre.");
            lancerQuestions2();
        }
    });
};

lancerQuestions1();