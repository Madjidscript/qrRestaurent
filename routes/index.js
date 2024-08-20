var express = require('express');
const upload = require('../middleware/multer');
const controllerAdmin = require('../controller/controllerAdmin');

var router = express.Router();

/* GET home page. */
router.get('/commande', controllerAdmin.commande) 
router.get('/commande/:id', controllerAdmin.commandes) 
router.get('/cathegorie', controllerAdmin.cathegorie) 
router.post('/cathegorie',upload.single('image'), controllerAdmin.cathegoriePost)  
router.get('/souscathegorie', controllerAdmin.souscathegorie) 
router.post('/souscathegorie',upload.single('image'), controllerAdmin.souscathegoriePost) 
router.get('/stock', controllerAdmin.stock) 
router.post('/stock', controllerAdmin.stockPost) 
router.get('/stockUpdate', controllerAdmin.stockUpdate) 
router.post('/stockUpdate', controllerAdmin.stockUpdatePost) 
router.get('/inscription', controllerAdmin.inscription) 
router.post('/inscription', controllerAdmin.inscriptionPost) 
router.get('/connexion', controllerAdmin.connexion) 
router.post('/connexion', controllerAdmin.connexionPost) 
router.get('/message', controllerAdmin.message) 
router.get('/deconnexion', controllerAdmin.Deconnexion) 
router.post('/react', controllerAdmin.react) 
router.get('/qrcodes', controllerAdmin.qrCodes)
module.exports = router;
