
const Cmmd = require("../model/modeleCommande")





const otherCmmd = class {
static afficheTout = async()=>{
  try {
    const affiche = await Cmmd.find()
    console.log("affiche Cmmd",affiche);
    return affiche
  } catch (error) {
  console.log("mon erreur",error);  
  }
}
static afficheTout2 = async(id)=>{
    try {
      const affiche = await Alergie.find({id_cath:id}).populate('id_cath')
      return affiche
    } catch (error) {
    console.log("mon erreur",error);  
    }
  }

static utilisarteuParID = async(id)=>{
    try {
        const recupParId = await Cmmd.findById(id)
         return recupParId
    } catch (error) {
        console.log("mon erreur",error);
    }
}

static utilisarteuParIndex = async(index)=>{
    try {
        const recupParId = await Cmmd.findOne({index:index})
         return recupParId
    } catch (error) {
        console.log("mon erreur",error);
    }
}

static utilisateurParEmail = async(email)=>{
    try {
        const recupParEmail = await Cmmd.findOne({email:email})
        return recupParEmail
    } catch (error) {
        console.log("mon erreur",error);
    }
}

static inscription = async(utilisateur)=>{
    try {

        const inscription  = await Cmmd.insertMany(utilisateur)
        return inscription
    } catch (error) {
        console.log('mon erreur',error);
    }
}

static suppression = async(id)=>{
    try {
        const supp = await Cmmd.findByIdAndDelete(id)
        return supp
    } catch (error) {
        console.log("mon erreur",error);
    }
}

static suppression2 = async (index) => {
    try {
      const supp = await Cmmd.findOneAndDelete({ index: index });
      return supp;
    } catch (error) {
      console.log("mon erreur", error);
    }
  }
static update= async(id,statut)=>{
    try {
        const modif = await Cmmd.findById(id)
        console.log("id la sssssss" ,modif.id,"mon statut favorable",modif.statut);
        statut=modif.statut
        const modifs = await Cmmd.findByIdAndUpdate(modif._id,{statut:!statut})
        console.log("momo",modifs);
        return modifs
    } catch (error) {
        console.log("mon erreur",error);
    }
}





}
module.exports= otherCmmd