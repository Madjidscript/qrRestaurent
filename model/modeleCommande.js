const validator = require('validator')
const mongoose= require('mongoose')
const modelSchema = mongoose.Schema({
num:{type:Number,required:true},
total:{type:String,required:true},
statut: { type: Boolean, default: true },
data:{type:Array,required:true},


})
const Cmmd = mongoose.model("Cmmd",modelSchema)
module.exports = Cmmd