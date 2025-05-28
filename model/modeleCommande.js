const validator = require('validator')
const mongoose= require('mongoose')
const modelSchema = mongoose.Schema({
num:{type:Number,required:true},
total:{type:String,required:true},
index:{type:String,required:true},
statut: {type:String,required:true},
data:{type:Array,required:true},
alergit: {type:Array,default:"pas d'arlergie"}, 

})
const Cmmd = mongoose.model("Cmmd",modelSchema)
module.exports = Cmmd