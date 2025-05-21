const SousCathegorie = require("../model/modelSousCathegorie")



const otherSousCathegorie = class {
static afficheTout = async()=>{
  try {
    const affiche = await SousCathegorie.find().populate('id_cath')
    return affiche
  } catch (error) {
  console.log("mon erreur",error);  
  }
}
static afficheTout2 = async(id)=>{
  try {
    const affiche = await SousCathegorie.find({id_cath:id}).populate('id_cath')
    return affiche
  } catch (error) {
  console.log("mon erreur",error);  
  }
}


static utilisarteuParID = async(id)=>{
    try {
        const recupParId = await SousCathegorie.findById(id)
         return recupParId
    } catch (error) {
        console.log("mon erreur",error);
    }
}

static utilisateurParEmail = async(email)=>{
    try {
        const recupParEmail = await SousCathegorie.findOne({email:email})
        return recupParEmail
    } catch (error) {
        console.log("mon erreur",error);
    }
}

static soucathbycath = async(id)=>{
    try {
        const recupParEmail = await SousCathegorie.findById({id_cath:id})
        return recupParEmail
    } catch (error) {
        console.log("mon erreur",error);
    }
}

static inscription = async(utilisateur)=>{
    try {
        const inscription  = await SousCathegorie.insertMany(utilisateur)
        return inscription
    } catch (error) {
        console.log('mon erreur',error);
    }
}

static suppression = async(id)=>{
    try {
        const supp = await SousCathegorie.findByIdAndRemove(id)
        return supp
    } catch (error) {
        console.log("mon erreur",error);
    }
}
static update= async(id,data)=>{
    try {
        const modif = await SousCathegorie.findByIdAndUpdate(id,data)
        return modif
    } catch (error) {
        console.log("mon erreur",error);
    }
}
}
module.exports= otherSousCathegorie