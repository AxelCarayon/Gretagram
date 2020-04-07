// Initialize express router
let router = require('express').Router();

// Set default API response
router.get('/', function(req, res) {
    res.json({
        status: 'API en marche',
        message: 'API RESTful de Gretagram'
    });
});

// Lien vers les controlleurs==================================================
var userController = require('./controller/userController');
var loginController = require('./controller/loginController');
var publicationController = require('./controller/publicationController');
var hashtagController = require('./controller/HashtagController');
var photoController = require('./controller/PhotoController')
    // ============================================================================


//routes ======================================================================
router.route('/user')
    .get(userController.view) //afficher
    .patch(userController.update) //modifier
    .post(userController.new) //ajouter
    .delete(userController.delete); //supprimer

router.route('/login')
    .get(loginController.login); //se logger

router.route('/publication')
    .get(publicationController.view) //afficher
    .patch(publicationController.update) //modifier
    .post(publicationController.new) //ajouter
    .delete(publicationController.delete) //supprimer
    .put(publicationController.like); //liker une photo

router.route('/hashtag')
    .get(hashtagController.view) //afficher
    .patch(hashtagController.update) //modifier
    .post(hashtagController.new) //ajouter
    .delete(hashtagController.delete); //supprimer

router.route('/photo')
    .get(photoController.view) //afficher
    .post(photoController.new) //ajouter
    .delete(photoController.delete) //supprimer
    .patch(photoController.update) //mettre à jour une pp
    // ============================================================================

// export des routes
module.exports = router;