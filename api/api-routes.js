// Initialize express router
const router = require('express').Router();

// Set default API response
router.get('/', function(req, res) {
    res.json({
        status: 'API en marche',
        message: 'API RESTful de Gretagram'
    });
});

// Lien vers les controlleurs==================================================
const userController = require('./controller/userController');
const loginController = require('./controller/loginController');
const publicationController = require('./controller/publicationController');
const hashtagController = require('./controller/HashtagController');
const photoController = require('./controller/PhotoController');
const likeCommentController = require('./controller/likeCommentController');
// ============================================================================


//routes ======================================================================
router.route('/user')
    .get(userController.view) //afficher
    .patch(userController.update) //modifier
    .post(userController.new) //ajouter
    .delete(userController.delete) //supprimer
    .put(userController.subscribe); //abonnner/désabonner

router.route('/user/pp')
    .post(userController.pp) //change la PP

router.route('/private')
    .get(userController.private);

router.route('/login')
    .get(loginController.login); //se logger

router.route('/publication')
    .get(publicationController.view) //afficher
    .patch(publicationController.update) //modifier
    .post(publicationController.new) //ajouter
    .delete(publicationController.delete); //supprimer

router.route('/publication/proche')
    .get(publicationController.proche);

router.route('/publication/zone')
    .get(publicationController.carre);

router.route('/recherche/hashtag')
    .get(hashtagController.search);

router.route('/recherche/user')
    .get(userController.search);

router.route('/populaire/hashtag')
    .get(hashtagController.populaire);

router.route('/publication/all')
    .get(publicationController.all);

router.route('/publication/abonnes')
    .get(publicationController.abonnes);

router.route('/publication/populaire')
    .get(publicationController.populaire);

router.route('/hashtag')
    .get(hashtagController.view) //afficher
    .patch(hashtagController.update) //modifier
    .post(hashtagController.new) //ajouter
    .delete(hashtagController.delete); //supprimer

router.route('/photo')
    .get(photoController.view) //afficher
    .post(photoController.new) //ajouter
    .delete(photoController.delete) //supprimer
    .patch(photoController.update); //mettre à jour une pp

router.route('/publication/like')
    .get(likeCommentController.view) //afficher nb likes
    .post(likeCommentController.like); //ajouter/enlever like

router.route('/publication/comment')
    .post(likeCommentController.new); //ajouter commententaire
// ============================================================================

// export des routes
module.exports = router;