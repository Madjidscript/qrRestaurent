const validator = require('validator')
const mongoose= require('mongoose')
const modelSchema = mongoose.Schema({
nombre:{type:Number,required:true},
id_Souscat:{type:mongoose.Schema.Types.ObjectId,
    ref:'SousCathegorie'
}
})
const Stock = mongoose.model("Stock",modelSchema)
module.exports = Stock



