const mongoose = require("mongoose");
const schema = require("./schema");

require("dotenv").config({ path: __dirname + '/config.env' });

const uri = process.env.URI

mongoose.connect(uri)
    .then(() => {
        console.log("Conexión exitosa con MongoDB");
    })
    .catch(() => {
        console.log("Error al conectar con MongoDB");
    })



const User = mongoose.model('User', schema.userSchema);
const Exercise = mongoose.model('Exercise', schema.exerciseSchema);

module.exports = {User, Exercise};