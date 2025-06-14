const validator = require('validator')
const mongoose= require('mongoose')

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },  // Exemple : WELCOME10
  reduction: { type: Number, required: true },            // Exemple : 10 (10%)
  isPercentage: { type: Boolean, default: true },         // true = %, false = montant fixe
  expirationDate: { type: Date },                         // Date limite
  maxUsage: { type: Number },                             // Nombre d’utilisations max
  usedCount: { type: Number, default: 0 },                // Utilisé combien de fois
  isActive: { type: Boolean, default: true },             // Actif ou désactivé
});
const Coupon = mongoose.model("Coupon",couponSchema)
module.exports = Coupon