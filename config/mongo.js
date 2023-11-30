const mongoose = require('mongoose')
require('dotenv').config()

async function connection() {
    await mongoose.connect(process.env.Mongo_url)
   console.log("connection a la bd reussit sans crainte");
}
module.exports ={
    connection
}