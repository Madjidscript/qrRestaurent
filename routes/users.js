var express = require('express');
const controllerMenu = require('../controller/controllerMenu');
const upload = require('../middleware/multer');
var router = express.Router();



/* GET users listing. */
router.get('/', controllerMenu.acceuil) 
router.get('/acceuil2/:id', controllerMenu.acceuil2) 
router.get('/afficher', controllerMenu.afficher) 
router.post('/afficher', controllerMenu.afficherPOst) 
router.get('/commande', controllerMenu.commande) 
router.get('/commande/:id', controllerMenu.commandes) 
router.get('/menu', controllerMenu.menu) 
router.post('/menu', controllerMenu.menuPost) 
router.get('/cathegorie', controllerMenu.cathegorie) 
router.post('/cathegorie',upload.single('image'), controllerMenu.cathegoriePost) 
router.get('/souscathegorie', controllerMenu.souscathegorie) 
router.post('/souscathegorie',upload.single('image'), controllerMenu.souscathegoriePost) 
router.get('/stock', controllerMenu.stock) 
router.post('/stock', controllerMenu.stockPost) 
router.get('/menuListe', controllerMenu.menuListe) 
router.post('/supp/:id', controllerMenu.menuListeSupp) 
 

module.exports = router;
