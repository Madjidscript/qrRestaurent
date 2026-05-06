const path = require("path/win32");
require('dotenv').config()

const Cathegorie = require("../model/modelCathegorie");
const SousCathegorie = require("../model/modelSousCathegorie");
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
 const { sendPushNotification } = require('../utils/push');
const PushNotif = require('../model/modelpush');
const Subscription = require('../model/modelSubscription');
// const QRCodeModel = require('../model/modelqrcode'); // Assurez-vous que le chemin est correct


const otherCathegorie = require("../other/otherCathegorie");
const otherSousCathegorie = require("../other/otherSouscathegorie");
const otherCmmd = require("../other/otherCmmd");
const otherStock = require("../other/otherStock");
const otherservice =require("../other/otherservice")
const otherqrcode =require("../other/otherqrcode")
const otherMenu = require("../other/otherUser");
const {response,request}= require('express');
const otherInscription = require("../other/otherInscription");
const { sendNotification,pose } = require("../utils/socket-io");
const generateAndSaveQRCodes = require("../middleware/qr");
const top5Plats = require("../middleware/top5")
const Cmds  = require("../model/modeleCommande")
const bcrypt = require("bcrypt");
const top5StocksInferieurs = require("../middleware/moinsstock");
const { log } = require("console");
const Stock = require("../model/modelStock");
const Qrcode = require("../model/modelqrcode");
const Coupon = require("../model/modelcoupon");
const axios = require('axios');


const controllerAdmin = class {
     
    static getstatut = async(req=request,res=response)=>{
     const status = await otherservice.getStatus();
     
     
     res.json(status);
      pose({
            type:"pose",
            statut:status,
           
          });
     

    }

    static updatestatut = async(req=request,res=response)=>{
    const { isOpen } = req.body;
    const status = await otherservice.setStatus(isOpen);
    res.json(status);

    pose({
            type:"pose",
            statut:status,
           
          });
    }



    static inscription = async(req=request,res=response)=>{
      let message =""
      if (req.session.admin) {
        message=" session reuissit"
        res.json(message)
      } else {
        message="session echouer"
        res.json(message)
      }
     
    }
    static inscriptionPost = async(req=request,res=response)=>{
      let msg=""
      const email =  req.body.email
      console.log('mon email',email);
      const password = await req.body.password
      const admin = await otherInscription.utilisateurParEmail(email)
      console.log('mon unique admin',admin,email,password);
      if (admin) {
        msg="admin existe deja!"
        res.json(msg)
      } else {
        const hashpass= await bcrypt.hash(password,10)
        console.log('mon passwords',hashpass);
        const data =  {
          nom:req.body.nom,
          email:req.body.email,
          password:hashpass
        }
        const insert = await otherInscription.inscription(data)
        console.log('inscription effectuer',insert);
        const data2 =  {
          nom:req.body.nom,
          email:req.body.email
          }
          msg="inscription effectuer"
          res.json(data2)
          
        
      }
      
    }
    static connexion = async(req=request,res=response)=>{
      res.render("connexion")
    }
    static connexionPost = async(req=request,res=response)=>{
      console.log("papa");
      
      let msg=""
      let status =""
      const email = req.body.email
      const password= req.body.password
      const admin = await otherInscription.utilisateurParEmail(email)
      if (!admin) {
        msg="admin pas retrouver"
        res.json(msg)
      }else{
       const  verifPass= await bcrypt.compare(password,admin.password)
       if (admin) {
        status="success"
        console.log("papa");
        
           const data = {
            nom:admin.nom,
            email:admin.email
            //password:admin.password
          }
          
          // req.session.admin= data
          console.log("ma sessions",req.session.admin);
          msg="connexion reussit"
          res.json({status,data})
        }else{
          msg="mot de pass incorrect"
          res.json(msg)
        }
      }
    }

    static Deconnexion = async(req=request,res=response)=>{
      req.session.destroy()
      res.redirect("/admin/connexion")
    }

    static cathegorie = async(req=request,res=response)=>{
      let msg =""
      const recup = await otherCathegorie.afficheTout()
       msg="cathegorie afficher"
        if(recup){ 
        res.json({msg,recup})
        console.log("ma session universelle",req.session.admin);
      } else {
        msg="cathegorie echouer"
        res.json(msg)
      }
      
    }
    static cathegoriePost = async(req=request,res=response)=>{
     let msg=""
     let status =""
      const insertion = await otherCathegorie.inscription({nom:req.body.nom,image:req.file.path})
      console.log('mon insertion cathegorie', insertion);
      if (insertion) {
        msg=" insertion reussit"
        status ="success" 
        res.json({insertion,status})
      }else{
        msg=" insertion reussit"
        status="echouer"
        res.json({msg,status})
      }
    }

    static souscathegorie = async(req=request,res=response)=>{
      let msg =""
      const recup = await otherSousCathegorie.afficheTout()
      if(recup){
        msg="souscath afficher"
        
        res.json({msg,recup})
        console.log('mes element recuperer', recup);
        
      }
       else {
        console.error('Erreur dans /admin/souscathegories:', error);
        msg="souscath eckouer"
        res.json(msg)
      }
      
    }


    static souscathegoriebycath = async (req = request, res = response) => {
      try {
        const { id_cath } = req.body
        const recup = await otherSousCathegorie.soucathbycath(id_cath)
        console.log("mon recup",recup)

        const sousCategoriesAvecStock = []

        for (const sousCat of recup) {
          const stock = await Stock.findOne({
                id_Souscat: sousCat._id,
                nombre: { $gt: 0 }
          })

          if (stock) {
                sousCategoriesAvecStock.push(sousCat)
          }
        }
    
        if (sousCategoriesAvecStock.length > 0) {
          res.json({
            msg: "Sous-catégories affichées avec succès",
            data: sousCategoriesAvecStock
          })
        } else {
          res.status(404).json({
            msg: "Aucune sous-catégorie trouvée pour cette catégorie"
          })
        }
      } catch (error) {
        console.error("Erreur dans /admin/souscathegories:", error)
        res.status(500).json({
          msg: "Erreur serveur",
          error: error.message
        })
      }
    }
    

    static souscathegoriePost = async(req=request,res=response)=>{
      let msg=""
      let status =""
      const imagePath = req.file.path.replace(/\//g, '\\'); // convertir / en \ pour MongoDB
      console.log("mon file hoo",imagePath);
      
      const insertion = await otherSousCathegorie.inscription({
        

        nom:req.body.nom,
        prix:req.body.prix,
        image:imagePath,
        id_cath:req.body.id_cath
      })
      console.log('mon insertion Souscathegorie', insertion);
      if (insertion) {
        msg ="insertion reuissit"
        status ="success"
        res.json({insertion,status})
      }else{
        msg ="insertion reuissit"
        res.json(msg)
      }
    }

    static stock = async(req=request,res=response)=>{
      
        const recup = await otherStock.afficheTout()
      console.log("voici ma recuperation stock",recup);
      if(recup){
        res.json(recup)
        console.log('mes element recuperer', recup);
        
      }
     
      }

    static stockPost = async(req=request,res=response)=>{
      let msg=""
      let status =""
      const data =req.body
      const insertion = await otherStock.inscription(data)
      console.log('mon insertion stock', insertion);
      if (insertion) {
        msg="stock enregistrer"
        status ="success"
        res.json({insertion,status,msg})
      }else{
        msg="stock echouer"
        res.json(msg)
      }
    }


    static stockUpdate = async(req=request,res=response)=>{
      let msg =""
     
        const recup = await otherSousCathegorie.afficheTout()
      console.log("voici ma recuperation stock",recup);
      if(recup){

        res.json(recup)
        console.log('mes element recuperer', recup);
        
      }
      
      }

      static stockUpdatePost = async(req=request,res=response)=>{
        let msg=""
        let status=""
        const data =req.body
        const id =req.body.id_Souscat
        const nbre =req.body.nombre
        console.log('mes ellement',data,id,nbre);
        const modification = await otherStock.update2(id,nbre)
        console.log('mon modification stock', modification);
        if (modification) {
          status="success"
          msg="modification reussit"
          res.json({modification,status})
        }else{
          msg="erreur lors de l'modification du stock"
          res.json(msg)
        }
      }
   
    

    static commande = async(req=request, res=response)=>{
      let msg=""
        const commande = await otherCmmd.afficheTout()
       
        if (commande) {
          msg="liste de commande reuissit"
          res.json(commande) 
            
        }
       else {
        msg="commande liste echouer"
        res.json(msg)
      }
  
    }

    static commandebyindex = async(req=request, res=response)=>{
      let msg=""
        const commande = await otherCmmd.commandeParIndex(req.params.index)
       
        if (commande) {
          msg="liste de commande reuissit"
          res.json(commande) 
            
        }
       else {
        msg="commande liste echouer"
        res.json(msg)
      }
  
    }

    // static commandes = async(req=request, res=response)=>{
    //   let msg=""
    //   let status=req.params.statut
    //   console.log("mon statut heee",status);
    //   const id = req.params.id
    //   console.log('mon id heeeee',req.params.id);
    //   const commandes = await otherCmmd.utilisarteuParID(id)
    //   let tb = commandes.data
    //   console.log("mon tbs",tb);

    //   console.log("mes commande sont la hooo",commandes._id)

    //   if (commandes) {
    //     const nouveauStatut=status
    //     commandes.statut=nouveauStatut
    //      const modif = await otherCmmd.update(id,nouveauStatut)
    //     console.log("ma modification",modif);
    //     const num = modif.num
    //     const index = modif.index
    //     console.log("ma num and index",num,index);
    //     if(nouveauStatut == "en_preparation"){
    //       sendNotification({
    //         type:"valider",
    //         num:num,
    //         index:index,
    //         statut:nouveauStatut,
    //         type_service:modif.type_service,
    //         message: `cher client votre commande à ala table ${num}  est  en cour de  preparation ..`,
    //       });
    //     }else if(nouveauStatut == "Servie"){

          
    //        tb.forEach(async (element) => {
    //               const modif = await otherStock.update(element.id, element.nbre);
    //         });


    //       sendNotification({
    //         type:"valider",
    //         num:num,
    //         index:index,
    //         statut:nouveauStatut,
    //         type_service:modif.type_service,
    //         message: `cher client votre commande à ala table ${num} est prete vous aller la recevoir dans un instant`,
    //       });

    //     }

    //     else if(nouveauStatut == "deleted_by_admin"){

          

    //       sendNotification({
    //         type:"valider",
    //         num:num,
    //         index:index,
    //         statut:nouveauStatut,
    //         type_service:modif.type_service,
    //         message: `cher client votre commande à ala table ${num} a été annuler pas l'admin`,
    //       });

    //     }

    //     msg="statut changer"
    //     status="success"
    //     res.json({modif,msg,status}) 
    //   }
  
    // }


  // modèle des subscriptions

static commandes = async (req = request, res = response) => {
  try {
    const statut = req.params.statut;
    const id = req.params.id;

    const commandes = await otherCmmd.utilisarteuParID(id);
    if (!commandes) {
      return res.status(404).json({ error: "Commande introuvable" });
    }

    const tb = commandes.data;

    const nouveauStatut = statut;
    await otherCmmd.update(id, nouveauStatut);

    const num = commandes.num;
    const index = commandes.index;

    let message = "";

    if (nouveauStatut === "en_preparation") {
      message = `Cher client, votre commande à la table ${num} est en cours de préparation.`;
    } else if (nouveauStatut === "Servie") {
      for (const element of tb) {
        await otherStock.update(element.id, element.nbre);
      }
      message = `Cher client, votre commande à la table ${num} est prête, vous allez la recevoir dans un instant.`;
    } else if (nouveauStatut === "deleted_by_admin") {
      message = `Cher client, votre commande à la table ${num} a été annulée par l'admin.`;
    }

    // Envoi WebSocket (si tu veux garder)
    sendNotification({
      type: "valider",
      num,
      index,
      statut: nouveauStatut,
      type_service: commandes.type_service,
      message
    });

    // 1. Créer et sauvegarder la notification en BDD d’abord
const notif = new PushNotif({
  emon_id: commandes.emon_id,
  title: "Mise à jour de votre commande",
  message,
  type: "valider",
  statut: nouveauStatut,
  data: {
    commandeId: commandes._id,
    date: new Date()
  }
});

await notif.save();
console.log("Notification enregistrée en BDD",commandes.emon_id,"my notif",notif);

// 2. Chercher la subscription de l’utilisateur pour envoyer la push
// const userSubscription = await PushNotif.findOne({ emon_id: commandes.emon_id });
const userSubscription = await Subscription.findOne({ emon_id: commandes.emon_id });


if (userSubscription) {
  try {
    await sendPushNotification(userSubscription.subscription, {
      emon_id: commandes.emon_id,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      statut: notif.statut
    });
    console.log(`Push envoyée avec succès à ${commandes.emon_id}`);
  } catch (err) {
    console.error(`Erreur lors de l'envoi de la push à ${commandes.emon_id} :`, err);
  }
} else {
  console.log("Utilisateur non abonné aux notifications push");
}


    res.json({ modif: commandes, msg: "Statut changé", status: "success" });
  } catch (err) {
    console.error("Erreur commandes:", err);
    res.status(500).json({ error: "Erreur interne" });
  }
}


static detailcmd = async(req=request, res=response)=>{
      let msg=""
      let status=""
   console.log("mon chao maho");
   const id = req.params.id
   console.log('mon id heeeee',req.params.id);
   const commandes = await otherCmmd.utilisarteuParID(id)
   console.log(" detail commande la hooo",commandes._id)

   if (commandes) {
     status="success"
     res.json({commandes,status}) 
   }else{
    msg="deatail commande echouer"
    res.json(msg)
   }

 } 

//  static getallcmdbyemonid = async(req=request, res=response)=>{
//       let msg=""
//       let status=""
//    console.log("mon chao maho");
//    const id = req.params.emon_id
//    console.log('mon id heeeee',req.params.id);
//    const commandes = await otherCmmd.cmmdbyemonid(id)
//   //  console.log(" detail commande la hooo",commandes._id)

//    if (commandes) {
//      status="success"
//      res.json({commandes,status}) 
//    }else{
//     msg="deatail commande echouer"
//     res.json(msg)
//    }

//  }

static getallcmdbyemonid = async(req = request, res = response) => {
  try {
    const id = req.params.emon_id;
    const commandes = await otherCmmd.cmmdbyemonid(id);

    if (commandes && commandes.length > 0) {
      res.json({ commandes, status: "success" });
    } else {
      res.json({ commandes: [], status: "empty", msg: "Aucune commande trouvée" });
    }
  } catch (error) {
    console.error("Erreur dans getallcmdbyemonid :", error);
    res.status(500).json({ status: "error", msg: "Erreur serveur" });
  }
};


 static detailcmdByindex = async(req=request, res=response)=>{
  let msg=""
  let status=""
console.log("mon chao maho");
const id = req.params.index
console.log('mon id heeeee',req.params.id);
const commandes = await otherCmmd.utilisarteuParIndex(id)
console.log(" detail commande la hooo",commandes._id)

if (commandes) {
 status="success"
 res.json({commandes,status}) 
}else{
msg="deatail commande echouer"
res.json(msg)
}

}
static anulecommandes = async(req=request, res=response)=>{

      console.log("mon chao maho");
      const id = req.params.id
      const num = parseInt(req.params.num, 10);
      console.log('mon id heeeee',req.params.id);
      const commandes = await otherCmmd.utilisarteuParID(id)
      // console.log("annule commande ",commandes._id)

      if (commandes) {
        
         const annule = await otherCmmd.suppression(id)
         sendNotification({
          type:"annuler",
          message: `commande annuler  a la table ${num}  !`,
        });
        let message="annulation de commande"
        res.json(message) 
      }
  
    }

    // static anulecommandesbyclient = async(req=request, res=response)=>{

    //   console.log("mon chao maho");
    //   const index = req.params.index
    //   const num = parseInt(req.params.num, 10);
    //   const statut = req.params.statut;
    //   console.log('mon id heeeee',req.params.index,req.params.num);
    //   const commandes = await otherCmmd.utilisarteuParIndex(index)
    //   // const commandes = await otherCmmd.update2(id,nouveauStatut)

    //   // console.log("annule commande ",commandes._id)

    //   if (commandes) {
        
    //     //  const annule = await otherCmmd.suppression2(index)
    //   const commandes = await otherCmmd.update2(index,statut)

    //      sendNotification({
    //       type:"annuler",
    //       message: `commande annuler  a la table ${num} pas lutilisateur !`,
    //     });
    //     let message="annulation de commande pas client"
    //     let status = "success"
    //     res.json({message,status}) 
    //   }else{
    //     let err = "erreur"
    //     res.json({err}) 

    //   }
  
    // }

    static anulecommandesbyclient = async (req = request, res = response) => {
  try {
    const clientId = req.headers['x-client-id'];
    const { index, num, statut } = req.params;
    const numTable = parseInt(num, 10);

    const table = await Qrcode.findOne({ number: numTable });
    if (!table || table.sessionId !== clientId) {
      return res.status(403).json({ message: "QR invalide ou accès refusé." });
    }

    const commandes = await otherCmmd.utilisarteuParIndex(index);
    if (commandes) {
      await otherCmmd.update2(index, statut);

      sendNotification({
        type: "annuler",
        message: `Commande annulée à la table ${num} par l'utilisateur !`,
      });

      // table.etat = 'libre';
      // table.sessionId = null;
      // table.lastChange = null;
      // await table.save();

      return res.json({ message: "Commande annulée par client", status: "success" });
    } else {
      return res.status(404).json({ message: "Commande introuvable." });
    }

  } catch (err) {
    console.error("Erreur annulation client:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// static anulecommandesbyclient = async (req = request, res = response) => {
//   try {
//     const clientId = req.headers['x-client-id'];
//     const { index, num, statut } = req.params;
//     const numTable = parseInt(num, 10);

//     const table = await Qrcode.findOne({ number: numTable });
//     if (!table || table.sessionId !== clientId) {
//       return res.status(403).json({ message: "QR invalide ou accès refusé." });
//     }

//     const commandes = await otherCmmd.utilisarteuParIndex(index);
//     if (commandes) {
//       await otherCmmd.update2(index, statut);

//       // --- Notification utilisateur ---
//       const notifUser = new PushNotif({
//         emon_id: commandes.emon_id,
//         title: "Annulation de commande",
//         message: `Votre commande à la table ${num} a été annulée avec succès.`,
//         type: "annuler",
//         statut: statut,
//         data: { commandeId: commandes._id, date: new Date() }
//       });
//       await notifUser.save();

//       const userSubscription = await PushNotif.findOne({ emon_id: commandes.emon_id });
//       if (userSubscription) {
//         try {
//           await sendPushNotification(userSubscription.subscription, {
//             emon_id: commandes.emon_id,
//             title: notifUser.title,
//             message: notifUser.message,
//             type: notifUser.type,
//             statut: notifUser.statut
//           });
//         } catch (err) {
//           console.error("Erreur envoi push utilisateur", err);
//         }
//       }

//       // --- Notification admin ---
//       // Ici, tu dois avoir un moyen d’identifier l’admin (ex : emon_id = "admin" ou autre)
//       // Par exemple, si tu stockes l’admin dans la collection Subscription avec emon_id = 'admin'
//       const adminSubscription = await PushNotif.findOne({ emon_id: "admin" });
//       if (adminSubscription) {
//         const notifAdmin = new PushNotif({
//           emon_id: "admin",
//           title: "Commande annulée par client",
//           message: `La commande à la table ${num} a été annulée par l'utilisateur.`,
//           type: "annuler",
//           statut: statut,
//           data: { commandeId: commandes._id, date: new Date() }
//         });
//         await notifAdmin.save();

//         try {
//           await sendPushNotification(adminSubscription.subscription, {
//             emon_id: "admin",
//             title: notifAdmin.title,
//             message: notifAdmin.message,
//             type: notifAdmin.type,
//             statut: notifAdmin.statut
//           });
//         } catch (err) {
//           console.error("Erreur envoi push admin", err);
//         }
//       }

//       return res.json({ message: "Commande annulée par client", status: "success" });
//     } else {
//       return res.status(404).json({ message: "Commande introuvable." });
//     }

//   } catch (err) {
//     console.error("Erreur annulation client:", err.message);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };




    // static validationcmmd = async (req = request, res = response) => {
    //   try {
    //     // Récupérer le nombre de QR codes à générer depuis le corps de la requête
    //     const body = req.body;
    //     const num =req.body.num
    //     const commandes = await otherCmmd.inscription(body)

    //     sendNotification({
    //       type:"valider",
    //       message: `commande effectuer  a la table ${num} !`,
    //     });
        
    //     // Répondre avec un message de succès
    //     console.log("commande  générés avec succès:", commandes);
    //     res.status(200).json({ message: "comande valider", commandes,status:"success" });
    //   } catch (error) {
    //     console.error("Erreur lors de la validation descmmd:", error.message);
    //     res.status(500).json({ message: "Une erreur est survenue.", error: error.message });
    //   }
    // }


//     static validationcmmd = async (req = request, res = response) => {
//   try {
//     const body = req.body;
//     const num = req.body.num;
//     const promoCode = req.body.promo;

//     const commandes = await otherCmmd.inscription(body);

//     if (promoCode) {
//       const coupon = await Coupon.findOne({ code: promoCode, isActive: true });

//       if (coupon) {
//         coupon.isActive = false;
//         await coupon.save();
//         console.log(`Coupon ${promoCode} désactivé après utilisation.`);
//       } else {
//         console.log(`Aucun coupon actif trouvé avec le code : ${promoCode}`);
//       }
//     }

//     // 🔔 Notification dans tous les cas
//     console.log("⚠️ Envoi de la notification...");
//      sendNotification({
//       type: "valider",
//       message: `cher admin Commande effectuée à la table ${num} !`,
//     });

//     console.log("Commande générée avec succès:", commandes);
//     res.status(200).json({ message: "Commande validée", commandes, status: "success" });

//   } catch (error) {
//     console.error("Erreur lors de la validation des commandes:", error.message);
//     res.status(500).json({ message: "Une erreur est survenue.", error: error.message });
//   }
// };


static validationcmmd = async (req = request, res = response) => {
  try {
    const clientId = req.headers['x-client-id'];
    const { num, promo, ...body } = req.body;
    const data = req.body
    const table = await Qrcode.findOne({ number: num });

    // 🔍 1. Récupération de l'adresse IP du client
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress;

    console.log("mon ip",ip);
    

//     // 🔍 2. Récupération de la localisation via ipapi
//   const response = await axios.get(`http://ip-api.com/json/${ip}`);
// const { city, regionName, country, lat, lon } = response.data;

// if (response.data.status === 'success') {
//   table.latitude = lat;
//   table.longitude = lon;
//   console.log(`📍 ${city}, ${regionName},${lat},${lon}, ${country}`);
// } else {
//   console.error("Erreur ip-api:", response.data.message);
// }


    // if (!table || !table.sessionIds.includes(clientId) ) {
    //   return res.status(403).json({ message: "QR invalide ou accès interdit." });
    // }
    console.log("madjid", req.body);
   
    const commandes = await otherCmmd.inscription(data);
    

    if (promo) {
      const coupon = await Coupon.findOne({ code: promo, isActive: true });
      if (coupon) {
        coupon.isActive = false;
        await coupon.save();
        console.log(`Coupon ${promo} désactivé après utilisation.`);
      }
    }

    // ✅ Retirer uniquement ce client de la table
    table.sessionIds = table.sessionIds.filter(id => id !== clientId);
    table.sessionId = null;
    table.lastChange = new Date();

    // Si plus personne à la table → libérer
    if (table.sessionIds.length === 0) {
      table.etat = 'libre';
      table.lastChange = null;
      console.log(`✅ Table ${num} libérée : plus aucun client.`);
    } else {
      console.log(`🍽️ Table ${num} encore occupée : ${table.sessionIds.length} client(s) restant(s).`);
    }

    await table.save();

    // 🔔 Notification
    sendNotification({
      type: "valider",
      message: `cher admin Commande effectuée à la table ${num} !`,
    });

    res.status(200).json({ message: "Commande validée", commandes, status: "success" });

  } catch (error) {
    console.error("Erreur validation:", error.message);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


      static message = async(req=request, res=response)=>{
           let msg=""
          const message = await otherStock.afficheTout()
          
          if (message) {
            res.json(msg,message) 
            console.log("ma session universelle",req.session.admin);  
            console.log('mes message hoo',message[0].nombre,message[0].id_Souscat.nom);
          }else{
            msg="liste de stock echouer"
            res.json(message)
          }
        
    
        }

      static react = async(req=request, res=response)=>{
       console.log(req.body);
  
        let message =""
       const email = req.body.email
       const password= req.body.password
       const admin = await otherInscription.utilisateurParEmail(email)
       if (!admin) {
         message ="'admin pas retrouver'"
         res.json(message)
         console.log("mon message",message);
       }else{
         const  verifPass= await bcrypt.compare(password,admin.password)
         if (verifPass) {
           const data = {
             nom:admin.nom,
             email:admin.email,
             password:admin.password
           }
           req.session.admin= data
           console.log("ma sessions",req.session.admin);
           message="connexion effectuer avec succes"
           res.json({message,data})
         }else{
          message="mot de pass incorrect"
           res.json(message)
           console.log("mon message2",message);
         }
       }
      }


      // static qr = async (req = request, res = response) => {
      //   try {
      //     // Exemple de tableau de nombres (id des tables)
      //     const tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    
      //     // Appeler la fonction pour générer et sauvegarder les QR codes
      //     const qrCodes = await generateAndSaveQRCodes(tableNumbers);
    
      //     console.log("QR Codes générés avec succès:", qrCodes);
      //   } catch (error) {
      //     console.error(
      //       "Erreur lors de la génération des QR codes:",
      //       error.message
      //     );
      //   }
      // };


      // static qr = async (req = request, res = response) => {
      //   try {
      //     // Récupérer le nombre de QR codes à générer depuis le corps de la requête
      //     const { number } = req.body;
      
      //     // Vérifier si un nombre valide est fourni
      //     if (!number || isNaN(number) || number <= 0) {
      //       return res.status(400).json({ message: "Veuillez fournir un nombre valide." });
      //     }
      
      //     // Créer un tableau basé sur le nombre demandé
      //     const tableNumbers = Array.from({ length: number }, (_, i) => i + 1);
      
      //     // Appeler la fonction pour générer et sauvegarder les QR codes
      //     const qrCodes = await generateAndSaveQRCodes(tableNumbers);
      
      //     // Répondre avec un message de succès
      //     console.log("QR Codes générés avec succès:", qrCodes);
      //     res.status(200).json({ message: "QR Codes générés avec succès.", qrCodes,status:"success" });
      //   } catch (error) {
      //     console.error("Erreur lors de la génération des QR codes:", error.message);
      //     res.status(500).json({ message: "Une erreur est survenue.", error: error.message });
      //   }
      // };

      static qr = async (req, res) => {
      try {
            const { number } = req.body;

            if (!number || isNaN(number) || number <= 0) {
                  return res.status(400).json({ message: "Veuillez fournir un nombre valide." });
            }

            const tableNumbers = Array.from({ length: number }, (_, i) => i + 1);
            const qrCodes = await generateAndSaveQRCodes(tableNumbers);

            console.log("QR Codes générés avec succès:", qrCodes);
            res.status(200).json({ message: "QR Codes générés avec succès.", qrCodes, status: "success" });
      } catch (error) {
            console.error("Erreur QR:", error.message);
            res.status(500).json({ message: "Erreur lors de la génération.", error: error.message });
      }
};

// static recupqr = async(req=request,res=response)=>{
//   const { token } = req.params;

//   const table = await Qrcode.findOne({ token });

//   if (!table) {
//     return res.status(404).send("Lien QR invalide ou expiré.");
//   }

//   const numeroTable = table.number;

//   // Tu peux ici envoyer une page ou des infos utiles pour cette table
//   res.json({ message: `Bienvenue à la table ${numeroTable}`, numeroTable });
// }  


// static recupqr = async (req, res) => {
//   const { token } = req.params;
//   const { sessionId } = req.query;

//   try {
//     const table = await Qrcode.findOne({ token });

//     if (!table) {
//       return res.json({ message: "QR Code invalide ou expiré veuillez scanner  à nouveau" });
//     }

//     // Si QR déjà en cours
//     if (table.etat === 'en_cours') {
//       if (table.sessionId === sessionId) {
//         // ✅ Même utilisateur, on le laisse continuer
//         return res.status(200).json({
//           message: `Bienvenue à la table ${table.number}`,
//           numeroTable: table.number
//         });
//       } else {
//         // ❌ Autre utilisateur, ne rien modifier
//         return res.json({ message: "QR déjà en cours par un autre utilisateur." });
//       }
//     }

//     // ✅ Si QR libre, on l’active pour ce sessionId
//     table.etat = 'en_cours';
//     table.sessionId = sessionId;
//     table.lastChange = new Date();
//     await table.save();

//     // ✅ Répondre immédiatement
//     res.status(200).json({
//       message: `Bienvenue à la table ${table.number}`,
//       numeroTable: table.number
//     });

//     // ⏱ Timer de libération après 60 minutes UNIQUEMENT pour l'utilisateur qui a activé
//     setTimeout(async () => {
//       try {
//         const current = await Qrcode.findOne({ number: table.number });

//         if (
//           current &&
//           current.etat === 'en_cours' &&
//           current.sessionId === sessionId
//         ) {
//           const newToken = uuidv4();
//           const newURL = `https://restaux-mmds.vercel.app/client/cath/${newToken}?from=scan`;
//           const newQRCode = await QRCode.toDataURL(newURL);

//           current.token = newToken;
//           current.qrCodeData = newQRCode;
//           current.etat = 'libre';
//           current.sessionId = null;
//           current.lastChange = null;
//           await current.save();

//           console.log(`⏱ Table ${table.number} libérée après 60 minutes sans commande.`);
//         }
//       } catch (err) {
//         console.error("⛔ Erreur dans le timer de libération :", err.message);
//       }
//     },  60 * 60 * 1000);

//   } catch (error) {
//     console.error("⛔ Erreur dans recupqr :", error.message);
//     res.status(500).json({ message: "Erreur serveur lors du scan." });
//   }
// };



static recupqr = async (req, res) => {
  const { token } = req.params;
  const { sessionId } = req.query;
  console.log("my token",token,"mysesionid",sessionId);
  

  try {
    const table = await Qrcode.findOne({ token });
    // num = table.number

    if (!table || sessionId =="null") {
      return res.json({ message: "QR Code invalide ou table prise . Veuillez scanner à nouveau." });
    }

    // 🔍 Étape 1 : Vérifier si ce sessionId est déjà sur une autre table
    const otherTable = await Qrcode.findOne({
      sessionIds: sessionId,
      etat: "en_cours",
      token: { $ne: token },
    });

    if (otherTable) {
      return res.json({
        status:"403",
        tokenactive:otherTable.token,
        message: `Vous êtes déjà connecté à la table ${otherTable.number}. Veuillez patienter ou libérer cette tables.`,
      });
    }

    // 🎯 Étape 2 : Ajouter ce sessionId s’il n’existe pas déjà
    if (!table.sessionIds.includes(sessionId)) {
      table.sessionIds.push(sessionId);
    }

    // Si la table était libre, on la passe à en_cours
    if (table.etat === "libre") {
      table.etat = "en_cours";
    }

    table.lastChange = new Date();
    await table.save();

    // ✅ Réponse immédiate
    res.status(200).json({
      message: `Bienvenue à la table ${table.number}`,
      numeroTable: table.number,
    });

    // ⏱ Timer 1h : supprimer ce sessionId
    setTimeout(async () => {
      try {
        const current = await Qrcode.findOne({ number: table.number });

        if (current && current.sessionIds.includes(sessionId)) {
          current.sessionIds = current.sessionIds.filter(id => id !== sessionId);
          await current.save();


          // Si plus aucun utilisateur, libérer la table
          if (current.sessionIds.length === 0) {
            // const newToken = uuidv4();
            // const newURL = `https://restaux-mmds.vercel.app/client/cath/${newToken}?from=scan`;
            // const newQRCode = await QRCode.toDataURL(newURL);
            // current.token = newToken;
            // current.qrCodeData = newQRCode;
            current.etat = "libre";
            current.lastChange = null;
          }

          await current.save();
          console.log(`⏱ Session ${sessionId} supprimée de la table ${current.number}`);
        }
      } catch (err) {
        console.error("⛔ Erreur dans le timer de libération :", err.message);
      }
    }, 60 * 60 * 1000);

  } catch (error) {
    console.error("⛔ Erreur dans recupqr :", error.message);
    res.status(500).json({ message: "Erreur serveur lors du scan." });
  }
};





      static qrCodes = async(req=request, res=response)=>{
        let msg=""
          const recup = await otherqrcode.afficheTout()
          console.log('moais differente cathegorie',recup);
          if (recup) {
            msg="qr afficher"
            res.json({msg,recup})
            console.log('mon preemier plat',recup[0].number);
          }else{
           msg='erreur de daffichage qr'
           res.json(msg)
          }
        
        
        
      }

      // static coubre = async(req=request, res=response)=>{
         
      //   const stock = await otherStock.afficheTout()
      //   const cmd = await otherCmmd.afficheTout()
      //   const Servie = cmd.filter(e => e.statut=="Servie").length;
      //   const preparation = cmd.filter(e => e.statut=="en_preparation").length;
      //   const deleted_by_user =  cmd.filter(e => e.statut=="deleted_by_user").length;
      //   const deleted_by_admin =  cmd.filter(e => e.statut=="deleted_by_admin").length;
      //   const en_attente =  cmd.filter(e => e.statut=="en_attente").length;
      //   const topPlats = top5Plats(cmd);
      //   const stockinf = top5StocksInferieurs(stock)

      //   res.json({deleted_by_user,Servie,cmd,topPlats,stockinf,en_attente,preparation,deleted_by_admin})
      // }

static coubre = async (req = request, res = response) => {
  try {
    // 📦 Récupération du stock complet
    const stock = await otherStock.afficheTout();

    // 📊 Statistiques par statut avec MongoDB
    const cmdStats = await Cmds.aggregate([
      {
        $group: {
          _id: "$statut",
          total: { $sum: 1 }
        }
      }
    ]);

    // Transformer le résultat en objet clé → valeur
    const stats = {
      Servie: 0,
      en_preparation: 0,
      deleted_by_user: 0,
      deleted_by_admin: 0,
      en_attente: 0
    };

    cmdStats.forEach(s => {
      stats[s._id] = s.total;
    });

    // 📈 Top 5 plats (on peut aussi faire en aggregate si tu veux)
    const cmd = await otherCmmd.afficheTout();
    const topPlats = top5Plats(cmd);

    // 📉 Stocks faibles
    const stockinf = top5StocksInferieurs(stock);

    // Réponse JSON optimisée
    res.json({
      deleted_by_user: stats.deleted_by_user,
      Servie: stats.Servie,
      cmd,
      topPlats,
      stockinf,
      en_attente: stats.en_attente,
      preparation: stats.en_preparation,
      deleted_by_admin: stats.deleted_by_admin
    });

  } catch (error) {
    console.error("Erreur dans coubre:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



static creatcoupon = async(req=request,res=response)=>{
  try {
    const { code, reduction, isPercentage, expirationDate, maxUsage } = req.body;

    const existing = await Coupon.findOne({ code });
    if (existing) return res.status(400).json({ message: 'Code déjà utilisé' });

    const coupon = new Coupon({
      code,
      reduction,
      isPercentage,
      expirationDate,
      maxUsage
    });

    await coupon.save();
    res.status(201).json({ message: 'Coupon créé avec succès', coupon });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}  

static gatallcoupon = async(req=request,res=response)=>{
  try {
    const coupons = await Coupon.find();
    res.status(200).json({ message: 'Coupons récupérés avec succès', coupons });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}  

static verifcoupon = async(req=request,res=response)=>{
 try {
    const { code } = req.params;
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
      return res.json({  message: 'Coupon invalide' });
    }

    const now = new Date();

    if (coupon.expirationDate && now > coupon.expirationDate) {
      coupon.isActive = false; // Désactiver le coupon s'il est expiré
      await coupon.save();
      return res.json({ success: false, message: 'Coupon expiré' });
    }

    if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) {
      return res.json({ success: false, message: 'Coupon déjà utilisé au maximum' });
    }

    res.status(200).json({
      success: true,
      coupon: {
        code: coupon.code,
        reduction: coupon.reduction,
        isPercentage: coupon.isPercentage,
        expirationDate: coupon.expirationDate,
        usedCount: coupon.usedCount
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}  

static deletecoupon = async(req=request,res=response)=>{
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon non trouvé' });
    }

    res.status(200).json({ success: true, message: 'Coupon supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}  




 static createsubcription = async(req=request, res=response)=>{
    const { emon_id, subscription } = req.body;
  if (!emon_id || !subscription) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  await Subscription.findOneAndUpdate(
    { emon_id },
    { subscription },
    { upsert: true, new: true }
  );

  res.status(201).json({ message: "Abonnement enregistré" });
 }

 static getsubcription = async(req=request, res=response)=>{
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });

 }



static changerStatutTable = async (req, res) => {
  try {
    const number = parseInt(req.params.number, 10);
    const { etat } = req.body;

    const etatsValides = ['libre', 'en_cours'];
    if (!etatsValides.includes(etat)) {
      return res.status(400).json({ message: `Statut invalide. Valeurs acceptées : ${etatsValides.join(', ')}` });
    }

    const table = await Qrcode.findOne({ number });
    if (!table) {
      return res.status(404).json({ message: `Table ${number} introuvable` });
    }

    const ancienEtat = table.etat;
    table.etat = etat;

    if (etat === 'libre') {
      table.sessionIds = [];
      table.sessionId = null;
      table.lastChange = null;
    } else {
      table.lastChange = new Date();
    }

    await table.save();
    console.log(`🔧 Table ${number} changée manuellement : ${ancienEtat} → ${etat}`);

    res.json({
      message: `Table ${number} mise à "${etat}" avec succès`,
      table: {
        number: table.number,
        etat: table.etat,
        sessionIds: table.sessionIds,
        lastChange: table.lastChange
      },
      status: 'success'
    });

  } catch (error) {
    console.error('Erreur changerStatutTable:', error.message);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}

}



module.exports = controllerAdmin