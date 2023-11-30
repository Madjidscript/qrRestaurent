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
}
module.exports = controllerMenu