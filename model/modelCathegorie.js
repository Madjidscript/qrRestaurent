const validator = require('validator')
const mongoose= require('mongoose')
const modelSchema = mongoose.Schema({
nom:{type:String,required:true},
image:{type:String,required:true},
})
const Cathegorie = mongoose.model("Cathegorie",modelSchema)
module.exports = Cathegorie