const validator = require('validator')
const mongoose= require('mongoose')

const modelSchema = mongoose.Schema({
num:{type:Number,required:true},
plat :{type:String,required:true},
boisson:{type:String,required:true}
})
const Menu = mongoose.model("Menu",modelSchema)
module.exports = Menu