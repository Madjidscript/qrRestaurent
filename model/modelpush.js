// models/PushNotif.js
const mongoose = require('mongoose');

const pushNotifSchema = mongoose.Schema({
  emon_id: { 
    type: String, 
    required: true // identifiant de l'utilisateur (comme dans Cmmd)
  },
  title: { 
    type: String, 
    required: true // titre de la notification
  },
  message: { 
    type: String, 
    required: true // contenu de la notification
  },
  type: { 
    type: String, 
    required: false // exemple: "valider", "annuler", etc.
  },
  statut: { 
    type: String, 
    required: false // statut lié à la commande ou notification
  },
  data: { 
    type: Object, 
    required: false // données supplémentaires si besoin
  },
  isRead: { 
    type: Boolean, 
    default: false // pour marquer la notification comme lue ou non
  },
  createdAt: { 
    type: Date, 
    default: Date.now // date d'envoi
  }
});

const PushNotif = mongoose.model("PushNotif", pushNotifSchema);

module.exports = PushNotif;
