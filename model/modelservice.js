const validator = require('validator')
const mongoose= require('mongoose')

const modelSchema = mongoose.Schema({
isOpen: {
    type: Boolean,
    required: true,
    default: true,
  },

})
const Service = mongoose.model("Service",modelSchema)
module.exports = Service