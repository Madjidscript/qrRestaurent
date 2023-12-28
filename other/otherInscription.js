
const Inscription = require("../model/modelInscription")




const otherInscription = class {
static afficheTout = async()=>{
  try {
    const affiche = await Inscription.find()
    console.log('mon affichage',affiche);
    return affiche
    
  } catch (error) {
  console.log("mon erreur",error);  
  }
}

static utilisarteuParID = async(id)=>{
    try {
        const recupParId = await Inscription.findById(id)
         return recupParId
    } catch (error) {
        console.log("mon erreur",error);
    }
}

static utilisateurParEmail = async(email)=>{
    try {
        const recupParEmail = await Inscription.findOne({email:email})
        return recupParEmail
    } catch (error) {
        console.log("mon erreur",error);
    }
}

static inscription = async(utilisateur)=>{
    try {
        const inscription  = await Inscription.insertMany(utilisateur)
        return inscription
    } catch (error) {
        console.log('mon erreur',error);
    }
}

static suppression = async(id)=>{
    try {
        const supp = await Inscription.findByIdAndRemove(id)
        return supp
    } catch (error) {
        console.log("mon erreur",error);
    }
}
static update= async(id,data)=>{
    try {
        const modif = await Inscription.findByIdAndUpdate(id,data)
        return modif
    } catch (error) {
        console.log("mon erreur",error);
    }
}
}
module.exports= otherInscription