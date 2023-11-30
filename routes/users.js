var express = require('express');
const controllerMenu = require('../controller/controllerMenu');
var router = express.Router();



/* GET users listing. */
router.get('/', controllerMenu.menu) 
router.post('/', controllerMenu.menuPost) 
router.get('/menuListe', controllerMenu.menuListe) 
router.post('/supp/:id', controllerMenu.menuListeSupp) 
 

module.exports = router;
