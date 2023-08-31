const mongoose = require("mongoose");




const userSchema = new mongoose.Schema({
    username: String,
})

exerciseSchema = new mongoose.Schema({
    userId: String,
    description: String,
    duration: Number,
    date: Date,
})


module.exports = { userSchema, exerciseSchema }