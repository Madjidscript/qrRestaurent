const path = require("path/win32");
const Cathegorie = require("../model/modelCathegorie");
const SousCathegorie = require("../model/modelSousCathegorie");

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

const bcrypt = require("bcrypt");
const top5StocksInferieurs = require("../middleware/moinsstock");
const { log } = require("console");
const Stock = require("../model/modelStock");
const Qrcode = require("../model/modelqrcode");
const Coupon = require("../model/modelcoupon");

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
          msg="connexion reusit"
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

    static commandes = async(req=request, res=response)=>{
      let msg=""
      let status=req.params.statut
      console.log("mon statut heee",status);
      const id = req.params.id
      console.log('mon id heeeee',req.params.id);
      const commandes = await otherCmmd.utilisarteuParID(id)
      let tb = commandes.data
      console.log("mon tbs",tb);

      console.log("mes commande sont la hooo",commandes._id)

      if (commandes) {
        const nouveauStatut=status
        commandes.statut=nouveauStatut
         const modif = await otherCmmd.update(id,nouveauStatut)
        console.log("ma modification",modif);
        const num = modif.num
        const index = modif.index
        console.log("ma num and index",num,index);
        if(nouveauStatut == "en_preparation"){
          sendNotification({
            type:"valider",
            num:num,
            index:index,
            statut:nouveauStatut,
            type_service:modif.type_service,
            message: `cher client votre commande à ala table ${num}  est  en cour de  preparation ..`,
          });
        }else if(nouveauStatut == "Servie"){

          
           tb.forEach(async (element) => {
                  const modif = await otherStock.update(element.id, element.nbre);
            });


          sendNotification({
            type:"valider",
            num:num,
            index:index,
            statut:nouveauStatut,
            type_service:modif.type_service,
            message: `cher client votre commande à ala table ${num} est prete vous aller la recevoir dans un instant`,
          });

        }

        else if(nouveauStatut == "deleted_by_admin"){

          

          sendNotification({
            type:"valider",
            num:num,
            index:index,
            statut:nouveauStatut,
            type_service:modif.type_service,
            message: `cher client votre commande à ala table ${num} a été annuler pas l'admin`,
          });

        }

        

        msg="statut changer"
        status="success"
        res.json({modif,msg,status}) 
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

    static anulecommandesbyclient = async(req=request, res=response)=>{

      console.log("mon chao maho");
      const index = req.params.index
      const num = parseInt(req.params.num, 10);
      const statut = req.params.statut;
      console.log('mon id heeeee',req.params.index,req.params.num);
      const commandes = await otherCmmd.utilisarteuParIndex(index)
      // const commandes = await otherCmmd.update2(id,nouveauStatut)

      // console.log("annule commande ",commandes._id)

      if (commandes) {
        
        //  const annule = await otherCmmd.suppression2(index)
      const commandes = await otherCmmd.update2(index,statut)

         sendNotification({
          type:"annuler",
          message: `commande annuler  a la table ${num} pas lutilisateur !`,
        });
        let message="annulation de commande pas client"
        let status = "success"
        res.json({message,status}) 
      }else{
        let err = "erreur"
        res.json({err}) 

      }
  
    }

    static validationcmmd = async (req = request, res = response) => {
      try {
  // Récupérer le corps de la requête
  const body = req.body;
  const num = req.body.num;
  const promoCode = req.body.promo;

  // Créer la commande
  const commandes = await otherCmmd.inscription(body);

  // Vérification du coupon
  if (promoCode) {
    const coupon = await Coupon.findOne({ code: promoCode, isActive:true});

    if (coupon) {
      coupon.isActive = false;
      await coupon.save();
      console.log(`Coupon ${promoCode} désactivé après utilisation.`);
      sendNotification({
    type: "valider",
    message: `cher admin Commande effectuée à la table ${num} !`,
  });
    } else {
      console.log(`Aucun coupon actif trouvé avec le code : ${promoCode}`);
      sendNotification({
    type: "valider",
    message: `cher admin Commande effectuée à la table ${num} !`,
  });
    }
  }

  // // Notification
  // sendNotification({
  //   type: "valider",
  //   message: `cher admin Commande effectuée à la table ${num} !`,
  // });

  // Réponse
  console.log("Commande générée avec succès:", commandes);
  res.status(200).json({ message: "Commande validée", commandes, status: "success" });

} catch (error) {
  console.error("Erreur lors de la validation des commandes:", error.message);
  res.status(500).json({ message: "Une erreur est survenue.", error: error.message });
}

    }

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

static recupqr = async(req=request,res=response)=>{
  const { token } = req.params;

  const table = await Qrcode.findOne({ token });

  if (!table) {
    return res.status(404).send("Lien QR invalide ou expiré.");
  }

  const numeroTable = table.number;

  // Tu peux ici envoyer une page ou des infos utiles pour cette table
  res.json({ message: `Bienvenue à la table ${numeroTable}`, numeroTable });
}  

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

      static coubre = async(req=request, res=response)=>{
         
        const stock = await otherStock.afficheTout()
        const cmd = await otherCmmd.afficheTout()
        const trueCount = cmd.filter(e => e.statut).length;
        const falseCount = cmd.length - trueCount;
        const topPlats = top5Plats(cmd);
        const stockinf = top5StocksInferieurs(stock)





        res.json({falseCount,trueCount,cmd,topPlats,stockinf})
          
        
        
        
      }


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
      return res.status(400).json({ success: false, message: 'Coupon expiré' });
    }

    if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) {
      return res.status(400).json({ success: false, message: 'Coupon déjà utilisé au maximum' });
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

      
  


      

      
    
      
}



module.exports = controllerAdmin