const validator = require('validator')
const mongoose= require('mongoose')

// const modelSchema = mongoose.Schema({
// number:{type:Number,required:true},
// token: { type: String, required: true, unique: true },   // token sécurisé
// qrCodeData:{type:String,required:true},
// date:{type: Date,default: Date.now}
// })
// const Qrcode = mongoose.model("Qrcode",modelSchema)
// module.exports = Qrcode



const modelSchema = mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  token: { type: String, required: true, unique: true },
  qrCodeData: { type: String, required: true },
  etat: {
    type: String,
    enum: ['libre', 'en_cours', 'utilisé'],
    default: 'libre'
  },
  lastChange: { type: Date, default: null },
  date: { type: Date, default: Date.now }
});

const Qrcode = mongoose.model("Qrcode",modelSchema)
module.exports = Qrcode