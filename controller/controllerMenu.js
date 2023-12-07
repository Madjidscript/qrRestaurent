const path = require("path/win32");
const Cathegorie = require("../model/modelCathegorie");
const SousCathegorie = require("../model/modelSousCathegorie");
const otherCathegorie = require("../other/otherCathegorie");
const otherSousCathegorie = require("../other/otherSouscathegorie");

const otherStock = require("../other/otherStock");
const otherMenu = require("../other/otherUser");
const {response,request}= require('express')


const controllerMenu = class {
    static menu = (req=request,res=response)=>{
      res.render('menu')
    };
    static menuPost =  async(req=request,res= response)=>{
       const menu = await req.body
       const Menuchoisir = await otherMenu.inscription(menu)
       const menuId = Menuchoisir._id
       console.log('mon menu',Menuchoisir);
       req.session.menus = {
        id:menuId,
        ...menu
       }
       if (Menuchoisir) {
        res.render('menu',{Menu:req.session.menus})
        console.log("ma session",req.session.menus);
        console.log("mon id ",req.session.menus.id);
       }
    }
    static menuListe = async(req=request,res= response)=>{
     const listeCommandes = await otherMenu.afficheTout()
     res.render('listecommande',{"commandes":listeCommandes})
     console.log("la liste de mon article",listeCommandes);
    }
    static menuListeSupp = async(req=request,res= response)=>{
      if (req.session.menus) {
        console.log('ma session',req.session.menus);
        const id = await req.session.menus.id
       const listeCommandes = await otherMenu.suppression(id)
       res.redirect('/menuListe')
      }else{
        console.log('il existe une erreur fatale');
      }
     
    }
    static cathegorie = async(req=request,res=response)=>{
      res.render("cathegorie")
    }
    static cathegoriePost = async(req=request,res=response)=>{
      
      const insertion = await otherCathegorie.inscription({nom:req.body.nom,image:req.file.path})
      console.log('mon insertion cathegorie', insertion);
      if (insertion) {
        res.redirect('/cathegorie')
      }
    }
    static souscathegorie = async(req=request,res=response)=>{
      const recup = await otherCathegorie.afficheTout()
      if(recup){
        res.render('souscathegorie',{"recups":recup})
        console.log('mes element recuperer', recup);
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
        res.redirect('/souscathegorie')
      }
    }
    static stock = async(req=request,res=response)=>{
      const recup = await otherSousCathegorie.afficheTout()
      console.log("voici ma recuperation stock",recup);
      if(recup){
        res.render('stock',{"recups":recup})
        console.log('mes element recuperer', recup);
      }
      }
    static stockPost = async(req=request,res=response)=>{
      const data =req.body
      const insertion = await otherStock.inscription(data)
      console.log('mon insertion stock', insertion);
      if (insertion) {
        res.redirect('/stock')
      }
    }
    static acceuil = async(req=request, res=response)=>{
      const recup = await otherCathegorie.afficheTout()
      console.log('moais differente cathegorie',recup);
      if (recup) {
        res.render('acceuil',{recups:recup})
        console.log('mon preemier plat',recup[0].nom);
      }
      
    }
    static acceuil2 = async(req=request, res=response)=>{
      const id = req.params.id
      console.log('mon nom hoioo',id);
      const recup = await otherSousCathegorie.afficheTout2(id) 
      console.log('moais differente cathegorie',recup);
      if (recup) {
        res.render('acceuil2',{recups:recup,req:req})
        console.log('mon preemier plat',recup[0].nom);
      }
      
    }
}
module.exports = controllerMenu