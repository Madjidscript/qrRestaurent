const mongoose = require('mongoose')
require('dotenv').config()

async function connection() {
    await mongoose.connect(process.env.Mongo_url)
    .then(() => {
        console.log('Connexion à MongoDB réussie')
        console.log("voici mon port","http://localhost:7000/index?numtable=18");
    })
    
    .catch((error) => console.error('Erreur de connexion à MongoDB', error));
   console.log("connection a la bd reussit sans crainte");
}
module.exports ={
    connection
}