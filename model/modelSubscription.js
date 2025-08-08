// models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
  emon_id: { type: String, required: true },
  subscription: { type: Object, required: true }
});
const Subcription =mongoose.model("Subscription", subscriptionSchema)
module.exports = Subcription;