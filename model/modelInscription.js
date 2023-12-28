const validator = require('validator')
const mongoose= require('mongoose')
const modelSchema = mongoose.Schema({
nom:{type:String,required:true},
email:{type:String,required:true},
password:{type:String,required:true},
})
const Inscription = mongoose.model("Inscription",modelSchema)
module.exports = Inscription