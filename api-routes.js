// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function(req, res) {
    res.json({
        status: 'API en marche',
        message: 'API de Gretagram fonctionne :)'
    });
});
// Export API routes
module.exports = router;