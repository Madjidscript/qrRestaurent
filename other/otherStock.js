// const { stock } = require("../controller/controllerMenu");
const Stock = require("../model/modelStock")




const otherStock = class {
static afficheTout = async()=>{
  try {
    const affiche = await Stock.find().populate('id_Souscat')
    console.log("affiche stock",affiche);
    return affiche
  } catch (error) {
  console.log("mon erreur",error);  
  }
}

static utilisarteuParID = async(id)=>{
    try {
        const recupParId = await Stock.findById(id)
         return recupParId
    } catch (error) {
        console.log("mon erreur",error);
    }
}

static utilisateurParEmail = async(email)=>{
    try {
        const recupParEmail = await Stock.findOne({email:email})
        return recupParEmail
    } catch (error) {
        console.log("mon erreur",error);
    }
}

static inscription = async(utilisateur)=>{
    try {
        const inscription  = await Stock.insertMany(utilisateur)
        return inscription
    } catch (error) {
        console.log('mon erreur',error);
    }
}

static suppression = async(id)=>{
    try {
        const supp = await Stock.findByIdAndRemove(id)
        return supp
    } catch (error) {
        console.log("mon erreur",error);
    }
}
static update= async(id,nbre)=>{
    try {
        
        console.log('mon id');
        const modif = await Stock.findOne( {id_Souscat:id} )
        console.log('ma modification otherstock',modif.nombre);
        const modifNombre = modif.nombre-nbre
        console.log('heeeeee',modif.nombre);
        console.log('ma modifaction de mon nonbre',modifNombre);
        const modifs = await Stock.findByIdAndUpdate(modif._id,{ nombre: modifNombre})
         return modifs
    } catch (error) {
        console.log("mon erreur",error);
    }
}
}
module.exports= otherStock