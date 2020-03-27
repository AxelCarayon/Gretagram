// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();

// Set default API response
router.get('/', function(req, res) {
    res.json({
        status: 'API en marche',
        message: 'API RESTful de Gretagram'
    });
});

// Import user controller
var userController = require('./controller/userController'); // User routes
router.route('/user')
    .get(userController.view)
    .patch(userController.update)
    .post(userController.new)
    .delete(userController.delete);

router.route('/login')
    .get(userController.login);



// Export API routes
module.exports = router;