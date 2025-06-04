const Service = require("../model/modelservice")


const otherService = class {
// 🔎 Récupérer le statut (isOpen)
  static getStatus = async () => {
    try {
      const status = await Service.findOne();
      return status; // renvoie { isOpen: true } ou false
    } catch (error) {
      console.log("Erreur lors de la récupération du statut :", error);
    }
  }

  // 🔁 Modifier le statut (true / false)
  static setStatus = async (nouveauStatut) => {
    try {
      let status = await Service.findOne();

      if (!status) {
        // S’il n’existe pas encore, on le crée
        status = await Service.create({ isOpen: nouveauStatut });
      } else {
        // Sinon on le met à jour
        status.isOpen = nouveauStatut;
        await status.save();
      }

      return status;
    } catch (error) {
      console.log("Erreur lors de la mise à jour du statut :", error);
    }
  }
}
module.exports= otherService