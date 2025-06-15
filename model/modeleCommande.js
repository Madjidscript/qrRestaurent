const validator = require('validator')
const mongoose= require('mongoose')
const modelSchema = mongoose.Schema({
num:{type:Number,required:true},
total:{type:String,required:true},
type_service:{type:String,required:true},
emon_id:{type:String,required:true},
index:{type:String,required:true},
statut: {type:String,required:true},
data:{type:Array,required:true},
alergit: {type:Array,default:"pas d'arlergie"}, 
promo: {type:String,required:false}, 

})
const Cmmd = mongoose.model("Cmmd",modelSchema)
module.exports = Cmmd