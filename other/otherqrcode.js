const Qrcodes = require("../model/modelqrcode")


const otherQrcodes = class {
static afficheTout = async()=>{
  try {
    const affiche = await Qrcodes.find()
    return affiche
  } catch (error) {
  console.log("mon erreur",error);  
  }
}

static utilisarteuParID = async(id)=>{
    try {
        const recupParId = await Qrcodes.findById(id)
         return recupParId
    } catch (error) {
        console.log("mon erreur",error);
    }
}

static utilisateurParEmail = async(email)=>{
    try {
        const recupParEmail = await Qrcodes.findOne({email:email})
        return recupParEmail
    } catch (error) {
        console.log("mon erreur",error);
    }
}

static inscription = async(utilisateur)=>{
    try {
        const inscription  = await Qrcodes.insertMany(utilisateur)
        return inscription[0]
    } catch (error) {
        console.log('mon erreur',error);
    }
}

static suppression = async(id)=>{
    try {
        const supp = await Qrcodes.findByIdAndRemove(id)
        return supp
    } catch (error) {
        console.log("mon erreur",error);
    }
}
static update= async(id,data)=>{
    try {
        const modif = await Qrcodes.findByIdAndUpdate(id,data)
        return modif
    } catch (error) {
        console.log("mon erreur",error);
    }
}
}
module.exports= otherQrcodes