const path = require("path/win32");
const Cathegorie = require("../model/modelCathegorie");
const SousCathegorie = require("../model/modelSousCathegorie");
const otherCathegorie = require("../other/otherCathegorie");
const otherSousCathegorie = require("../other/otherSouscathegorie");
const otherCmmd = require("../other/otherCmmd");
const otherStock = require("../other/otherStock");
const otherMenu = require("../other/otherUser");
const {response,request}= require('express');
const otherInscription = require("../other/otherInscription");
const bcrypt = require("bcrypt")

const controllerAdmin = class {
    static inscription = async(req=request,res=response)=>{
      res.render("inscription")
    }
    static inscriptionPost = async(req=request,res=response)=>{
      const email =  req.body.email
      console.log('mon email',email);
      const password = await req.body.password
      const admin = await otherInscription.utilisateurParEmail(email)
      console.log('mon admin',admin,email,password);
      if (admin) {
        res.render("inscription",{message:"admin existe deja"})
      } else {
        const hashpass= await bcrypt.hash(password,10)
        console.log('mon password',hashpass);
        const data =  {
          nom:req.body.nom,
          email:req.body.email,
          password:hashpass
        }
        const insert = await otherInscription.inscription(data)
        console.log('inscription effectuer');
          res.redirect("/admin/connexion")
          
        
      }
      
    }
    static connexion = async(req=request,res=response)=>{
      res.render("connexion")
    }
    static connexionPost = async(req=request,res=response)=>{
      const email = req.body.email
      const password= req.body.password
      const admin = await otherInscription.utilisateurParEmail(email)
      if (!admin) {
        res.render('connexion',{message:'admin pas retrouver'})
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
          res.redirect("/admin/cathegorie")
        }
      }
    }

    static Deconnexion = async(req=request,res=response)=>{
      req.session.destroy()
      res.redirect("/admin/connexion")
    }
    static cathegorie = async(req=request,res=response)=>{
      if ( req.session.admin) {
        res.render("cathegorie",{data:req.session.admin})
        console.log("ma session universelle",req.session.admin);
      } else {
        res.redirect("/admin/connexion")
      }
      
    }
    static cathegoriePost = async(req=request,res=response)=>{
      const insertion = await otherCathegorie.inscription({nom:req.body.nom,image:req.file.path})
      console.log('mon insertion cathegorie', insertion);
      if (insertion) {
        res.render('cathegorie',{vv:"insertion effectuer avec succes"})
      }else{
        res.render('cathegorie',{vv:"erreur lors de linsertion de la cathegorie"})
      }
    }

    static souscathegorie = async(req=request,res=response)=>{
      if (req.session.admin) {
        const recup = await otherCathegorie.afficheTout()
      if(recup){
        res.render('souscathegorie',{"recups":recup,data:req.session.admin})
        console.log('mes element recuperer', recup);
        console.log("ma session universelle",req.session.admin);
      }
      } else {
       res.redirect("/admin/connexion") 
      }
      
    }
    static souscathegoriePost = async(req=request,res=response)=>{
      const insertion = await otherSousCathegorie.inscription({
        nom:req.body.nom,
        prix:req.body.prix,
        image:req.file.path,
        id_cath:req.body.id_cath
      })
      console.log('mon insertion Souscathegorie', insertion);
      if (insertion) {
        res.render('souscathegorie',{vv:'insertion effectuer avec succes'})
      }else{
        res.render('souscathegorie',{vv:"erreur  lors de l'insertion du souscathegorie"})
      }
    }

    static stock = async(req=request,res=response)=>{
      if (req.session.admin) {
        const recup = await otherSousCathegorie.afficheTout()
      console.log("voici ma recuperation stock",recup);
      if(recup){
        res.render('stock',{"recups":recup,data:req.session.admin})
        console.log('mes element recuperer', recup);
        console.log("ma session universelle",req.session.admin);
      }
      } else {
        res.redirect("/admin/connexion")
      }
      }

    static stockPost = async(req=request,res=response)=>{
      const data =req.body
      const insertion = await otherStock.inscription(data)
      console.log('mon insertion stock', insertion);
      if (insertion) {
        res.render('stock',{vv:"insertion effectuer avec succes"})
      }else{
        res.render('stock',{vv:"erreur lors de l'insertion du stock"})
      }
    }
   
    

    static commande = async(req=request, res=response)=>{
      if (req.session.admin) {
        const commande = await otherCmmd.afficheTout()
        if (commande) {
          res.render('commande',{"commandes":commande,data:req.session.admin}) 
          console.log("ma session universelle",req.session.admin);  
    }
      } else {
        res.redirect("/admin/connexion")
      }
  
      }

    static commandes = async(req=request, res=response)=>{
      console.log("mon chao maho");
      const id = req.params.id
      console.log('mon id heeeee',req.params.id);
      const commandes = await otherCmmd.afficheTout()
      console.log("mes commande sont la hooo",commandes._id)

      if (commandes) {
      
        commandes.forEach(async (element) => {
         let statut= element.statut
         statut="false"
          console.log("mes statut",statut,"mon id",id);
          const modif = await otherCmmd.update(id,statut)
          console.log("ma modification",modif);
        });
        res.redirect('/admin/commande') 
  }
  
      }
    
      
}
module.exports = controllerAdmin