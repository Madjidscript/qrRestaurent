var express = require('express');
const upload = require('../middleware/multer');
const controllerAdmin = require('../controller/controllerAdmin');
const controlerApi = require('../controller/controlerApi');
var router = express.Router();

/* GET home page. */
router.get('/commande', controllerAdmin.commande) 
router.get('/commande/:id', controllerAdmin.commandes) 
router.delete('/annulecommande/:id', controllerAdmin.anulecommandes) 
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


// controler des api 
router.get('/commandes', controlerApi.commande) 
router.get('/getstatut', controlerApi.getstatut) 
router.post('/updatestatut', controlerApi.updatestatut) 
router.get('/commandes/:id/:statut', controlerApi.commandes) 
router.get('/detailcmd/:id', controlerApi.detailcmd) 
router.get('/getallcmdbyemonid/:emon_id', controlerApi.getallcmdbyemonid) 
router.get('/detailcmdindex/:index', controlerApi.detailcmdByindex) 
router.delete('/annulecommandes/:id/:num', controlerApi.anulecommandes) 
router.delete('/annulecommandesbyclient/:index/:num/:statut', controlerApi.anulecommandesbyclient) 
router.get('/cathegories', controlerApi.cathegorie) 
router.post('/cathegoriesbycath', controlerApi.souscathegoriebycath) 
router.post('/validationcmmd', controlerApi.validationcmmd) 
router.post('/cathegories',upload.single('image'), controlerApi.cathegoriePost)  
router.get('/souscathegories', controlerApi.souscathegorie) 
router.post('/souscathegories',upload.single('image'), controlerApi.souscathegoriePost) 
router.get('/stocks', controlerApi.stock) 
router.post('/stocks', controlerApi.stockPost) 
router.get('/stockUpdates', controlerApi.stockUpdate) 
router.post('/stockUpdates', controlerApi.stockUpdatePost) 
router.get('/inscriptions', controlerApi.inscription) 
router.post('/inscriptions', controlerApi.inscriptionPost) 
router.get('/connexions', controlerApi.connexion) 
router.post('/connexions', controlerApi.connexionPost) 
router.get('/messages', controlerApi.message) 
router.get('/deconnexions', controlerApi.Deconnexion) 
router.post('/reacts', controlerApi.react) 
router.get('/qrcode', controlerApi.qrCodes)
router.post('/qrcode', controlerApi.qr)
router.get('/sigleqrcode/:token', controlerApi.recupqr)
router.get('/coubre', controlerApi.coubre)

router.post('/createcoupon', controlerApi.creatcoupon) 
router.get('/getcoupon', controlerApi.gatallcoupon) 
router.get('/verifcoupon/:code', controlerApi.verifcoupon) 
router.delete('/deletecoupon/:id', controlerApi.deletecoupon) 



module.exports = router;
