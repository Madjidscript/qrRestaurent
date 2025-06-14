const validator = require('validator')
const mongoose= require('mongoose')

const modelSchema = mongoose.Schema({
alergie:{type:String},
temperature:{type:String},

})
const Alergie = mongoose.model("Alergie",modelSchema)
module.exports = Alergie