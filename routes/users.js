var express = require('express');
const controllerMenu = require('../controller/controllerMenu');
const upload = require('../middleware/multer');
var router = express.Router();



/* GET users listing. */
router.get('/', controllerMenu.acceuil) 
router.get('/acceuil2/:id', controllerMenu.acceuil2) 
router.get('/afficher', controllerMenu.afficher) 
router.post('/afficher', controllerMenu.afficherPOst) 
router.get('/menu', controllerMenu.menu) 
router.post('/menu', controllerMenu.menuPost) 
router.get('/menuListe', controllerMenu.menuListe) 
router.post('/supp/:id', controllerMenu.menuListeSupp) 
 

module.exports = router;
