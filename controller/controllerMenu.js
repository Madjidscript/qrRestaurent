const path = require("path/win32");
const Cathegorie = require("../model/modelCathegorie");
const SousCathegorie = require("../model/modelSousCathegorie");
const otherCathegorie = require("../other/otherCathegorie");
const otherSousCathegorie = require("../other/otherSouscathegorie");
const otherCmmd = require("../other/otherCmmd");
// const otherqrcode =require("../other/otherqrcode")
const otherStock = require("../other/otherStock");
const otherMenu = require("../other/otherUser");
const generateAndSaveQRCodes = require("../middleware/qr");
const { response, request } = require("express");
const { sendNotification } = require("../utils/socket-io");
const { stock } = require("./controllerAdmin");

const controllerMenu = class {
  static menu = (req = request, res = response) => {
    res.render("menu");
  };
  static menuPost = async (req = request, res = response) => {
    const menu = await req.body;
    const Menuchoisir = await otherMenu.inscription(menu);
    const menuId = Menuchoisir._id;
    console.log("mon menu", Menuchoisir);
    req.session.menus = {
      id: menuId,
      ...menu,
    };
    if (Menuchoisir) {
      res.render("menu", { Menu: req.session.menus });
      console.log("ma session", req.session.menus);
      console.log("mon id ", req.session.menus.id);
    }
  };
  static menuListe = async (req = request, res = response) => {
    const listeCommandes = await otherMenu.afficheTout();
    res.render("listecommande", { commandes: listeCommandes });
    console.log("la liste de mon article", listeCommandes);
  };
  static menuListeSupp = async (req = request, res = response) => {
    if (req.session.menus) {
      console.log("ma session", req.session.menus);
      const id = await req.session.menus.id;
      const listeCommandes = await otherMenu.suppression(id);
      res.redirect("/menuListe");
    } else {
      console.log("il existe une erreur fatale");
    }
  };

  static indexs = async (req = request, res = response) => {
    const id = parseInt(req.query.numtable, 10);
    const recup = await otherCathegorie.afficheTout();

    console.log(
      "moais differente cathegorie",
      recup,
      "monid depuis lacceuil",
      id
    );
    if (recup) {
      res.render("indexs", { recups: recup, req: req, ids: id });
      console.log("mon preemier plat", recup[0].nom);
    }
  };
  static acceuil = async (req = request, res = response) => {
    const id = parseInt(req.query.numtable, 10);
    const recup = await otherCathegorie.afficheTout();

    console.log(
      "moais differente cathegorie",
      recup,
      "monid depuis lacceuil",
      id
    );
    if (recup) {
      res.render("acceuil", { recups: recup, req: req, ids: id });
      console.log("mon preemier plat", recup[0].nom);
    }
  };
  static acceuil2 = async (req = request, res = response) => {
   
    const id = req.params.id;
    const num = parseInt(req.query.numtable, 10);
    console.log("mon nom hoioo", id);
    const recup = await otherSousCathegorie.afficheTout2(id);
    const Stock = await Promise.all(recup.map(async(element)=>{
      console.log("mon idddooo",element._id)
      const stockdata = await otherStock.afficheTout2(element._id)
       
      return stockdata
     
    }));
    console.log("moais differente cathegorie", Stock);
    const flatStock = Stock.flat();
        // Filtrer les données où le nombre est supérieur à zéro
        const filteredStock = flatStock.filter(stockItem => {
            //console.log("stockItem:", stockItem); // Assurez-vous que stockItem est défini ici
            
            return stockItem.nombre > 0;
        });
        console.log("filtrer ",filteredStock)
    if(filteredStock.length > 0){

      res.render("acceuil2", {
        data: filteredStock,
        recups: filteredStock,
        req: req,
        ids: num,
        id: id,
      });
      console.log("mon preemiers plats", recup[0].nom);
    }
  };
  static recherche = async (req, res) => {
    try {
      const id = req.params.id;
      console.log("ID reçu:", id);
      const recup = await otherSousCathegorie.afficheTout2(id);
      // console.log('notrrrrrrrrr',recup)
      const searchQuery = req.query.search || "";
      const filteredItems = recup.filter((item) =>
        item.nom.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("itemmmm", filteredItems);
      return res.json({ recups: filteredItems, searchQuery });
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      res.status(500).send("Erreur interne du serveur");
    }
  };

  static afficher = async (req = request, res = response) => {
    console.log("mon beugue");
    const id = req.params.id;
    const comande = otherCmmd.utilisarteuParID(id);
    try {
      const num = parseInt(req.query.numtable, 10);
      res.render("afficher", { ids: num });
    } catch (error) {
      console.error("eeeee", error.message);
      res.render("afficher", { error: error.message });
    }
  };
  static afficherPOst = async (req = request, res = response) => {
    const data = req.body;
    const data2 = data.data;
    const num = parseInt(req.query.numtable, 10);
    const insertion = await otherCmmd.inscription(data);
    
    if (insertion) {
      data2.forEach(async (element) => {
        const modif = await otherStock.update(element.id, element.nbre);
      });
      sendNotification({
        type:"commande",
        message: `cher admin nouvelle commande a la table ${num} !`,
      });
      res.json({ data: "commande effectuer avec succes", data2: insertion });
    }
  };

  static qr = async (req = request, res = response) => {
    try {
      // Exemple de tableau de nombres (id des tables)
      const tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

      // Appeler la fonction pour générer et sauvegarder les QR codes
      const qrCodes = await generateAndSaveQRCodes(tableNumbers);

      console.log("QR Codes générés avec succès:", qrCodes);
    } catch (error) {
      console.error(
        "Erreur lors de la génération des QR codes:",
        error.message
      );
    }
  };
};

module.exports = controllerMenu;
