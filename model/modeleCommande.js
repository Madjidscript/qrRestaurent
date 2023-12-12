const validator = require('validator')
const mongoose= require('mongoose')
const modelSchema = mongoose.Schema({
num:{type:String,required:true},
total:{type:String,required:true},
data:{type:Object,required:true},


})
const Cmmd = mongoose.model("Cmmd",modelSchema)
module.exports = Cmmd