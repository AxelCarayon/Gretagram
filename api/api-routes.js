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
    .delete(publicationController.delete); //supprimer

router.route('/hashtag')
    .get(hashtagController.view) //afficher
    .patch(hashtagController.update) //modifier
    .post(hashtagController.new) //ajouter
    .delete(hashtagController.delete); //supprimer
// ============================================================================


// export des routes
module.exports = router;