const path = require("path/win32");
const Cathegorie = require("../model/modelCathegorie");
const SousCathegorie = require("../model/modelSousCathegorie");

const otherCathegorie = require("../other/otherCathegorie");
const otherSousCathegorie = require("../other/otherSouscathegorie");
const otherCmmd = require("../other/otherCmmd");
const otherStock = require("../other/otherStock");
const otherqrcode =require("../other/otherqrcode")
const otherMenu = require("../other/otherUser");
const {response,request}= require('express');
const otherInscription = require("../other/otherInscription");
const { sendNotification } = require("../utils/socket-io");
const bcrypt = require("bcrypt")

const controllerAdmin = class {
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
      let msg=""
      const email = req.body.email
      const password= req.body.password
      const admin = await otherInscription.utilisateurParEmail(email)
      if (!admin) {
        msg="admin pas retrouver"
        res.json(msg)
      }else{
       const  verifPass= await bcrypt.compare(password,admin.password)
       if (admin) {
           const data = {
            nom:admin.nom,
             email:admin.email,
             password:admin.password
          }
          // const data = {
          //     nom:admin.nom,
          //      email:admin.email,
          //      password:admin.password
          //    }
          req.session.admin= data
          console.log("ma sessions",req.session.admin);
          meg="connexion reusit"
          res.json(data)
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
      const insertion = await otherCathegorie.inscription({nom:req.body.nom,image:req.file.path})
      console.log('mon insertion cathegorie', insertion);
      if (insertion) {
        msg=" insertion reussit"
        res.json(insertion)
      }else{
        msg=" insertion reussit"
        res.json(msg)
      }
    }

    static souscathegorie = async(req=request,res=response)=>{
      let msg =""
      const recup = await otherSousCathegorie.afficheTout()
      if(recup){
        msg="souscath afficher"
        res.json({msg,recup})
        console.log('mes element recuperer', recup);
        console.log("ma session universelle",req.session.admin);
      }
       else {
        msg="souscath eckouer"
        res.json(msg)
      }
      
    }
    static souscathegoriePost = async(req=request,res=response)=>{
      let msg=""
      const insertion = await otherSousCathegorie.inscription({
        nom:req.body.nom,
        prix:req.body.prix,
        image:req.file.path,
        id_cath:req.body.id_cath
      })
      console.log('mon insertion Souscathegorie', insertion);
      if (insertion) {
        msg ="insertion reuissit"
        res.json(insertion)
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
      const data =req.body
      const insertion = await otherStock.inscription(data)
      console.log('mon insertion stock', insertion);
      if (insertion) {
        msg="stock enregistrer"
        res.json(insertion)
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
        const data =req.body
        const id =req.body.id_Souscat
        const nbre =req.body.nombre
        console.log('mes ellement',data,id,nbre);
        const modification = await otherStock.update2(id,nbre)
        console.log('mon modification stock', modification);
        if (modification) {
          msg="modification reussit"
          res.json(modification)
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
      console.log("mon chao maho");
      const id = req.params.id
      console.log('mon id heeeee',req.params.id);
      const commandes = await otherCmmd.utilisarteuParID(id)
      console.log("mes commande sont la hooo",commandes._id)

      if (commandes) {
        const nouveauStatut=!commandes.statut
        commandes.statut=nouveauStatut
         const modif = await otherCmmd.update(id,commandes)
        console.log("ma modification",modif);
        msg="statut changer"
        res.json(modif) 
      }
  
    }
    static anulecommandes = async(req=request, res=response)=>{

      console.log("mon chao maho");
      const id = req.params.id
      const num = parseInt(req.query.numtable, 10);
      console.log('mon id heeeee',req.params.id);
      const commandes = await otherCmmd.utilisarteuParID(id)
      console.log("mes commande sont la hooo",commandes._id)

      if (commandes && commandes.statut=== true ) {
        
         const annule = await otherCmmd.suppression(id)
         sendNotification({
          type:"annuler",
          message: `commande annuler  a la table ${num} !`,
        });
        let message="annulation de commande"
        res.json(message) 
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

      static qrCodes = async(req=request, res=response)=>{
        let msg=""
          const recup = await otherqrcode.afficheTout()
          console.log('moais differente cathegorie',recup);
          if (recup) {
            msg="qr afficher"
            res.json(msg,recup)
            console.log('mon preemier plat',recup[0].number);
          }else{
           msg='erreur de daffichage qr'
           res.json(msg)
          }
        
        
        
      }

      
  


      

      
    
      
}
module.exports = controllerAdmin