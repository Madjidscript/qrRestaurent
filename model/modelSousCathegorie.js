const validator = require('validator')
const mongoose= require('mongoose')
const modelSchema = mongoose.Schema({
nom:{type:String,required:true},
prix:{type:Number,required:true},
image:{type:String,required:true},
id_cath:{type:mongoose.Schema.Types.ObjectId,
    ref:'Cathegorie',
    required:true
}
})
const SousCathegorie = mongoose.model("SousCathegorie",modelSchema)
module.exports = SousCathegorie