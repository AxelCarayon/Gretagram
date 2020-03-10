//connection à la base de donnée et supression
db = db.getSiblingDB('gretagram');
db.dropDatabase();

//on recrée la BDD
db.createCollection("users");
db.createCollection("publications");

//on crée une collection de compteur pour autoincrementer
db.createCollection("counters");
db.counters.insert({ _id: "userId", value: 0 });
db.counters.insert({ _id: "publicationId", value: 0 });

function getNextId(sequenceName) {

    var sequenceDocument = db.counters.findAndModify({
        query: { _id: sequenceName },
        update: { $inc: { value: 1 } },
        new: true
    });

    return sequenceDocument.value;
}


//PERSONNES
db.users.insert({
    "_id": getNextId("userId"),
    "prenom": "Maurice",
    "nom": "Lestin",
    "mail": "lestin.coquin@gmail.com",
    "age": 20,
    "sexe": "M",
    "publications": [1],
    "abonnements": [],
    "abonnes": [],
    "password": "Lestin69"

});

db.users.insert({
    "_id": getNextId("userId"),
    "prenom": "Mathilde",
    "nom": "Tchoin",
    "mail": "Michtodu81@gmail.com",
    "age": 21,
    "sexe": "F",
    "publications": [2],
    "abonnements": [],
    "abonnes": [],
    "password": "Migos"
});
//PUBLICATIONS

db.publications.insert({
    "_id": getNextId("publicationId"),
    "date": new Date(),
    "message": "Premiere publication de Lestin",
    "user": 1,
    "likes": 0
});

db.publications.insert({
    "_id": getNextId("publicationId"),
    "date": new Date(),
    "message": "Première publication de Mathilde",
    "user": 2,
    "likes": 0
});