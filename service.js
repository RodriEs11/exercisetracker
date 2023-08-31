const mongoose = require("mongoose");
const mongo = require("./mongo");


function save(object) {

    object.save()
        .then(() => {
            return object;
        })
        .catch(() => {
        });

}

function createUser(username) {

    return new mongo.User({
        username: username
    })
}

function createExercise(description, duration, date, user) {

    return new mongo.Exercise({
        userId: user._id,
        description: description,
        duration: duration,
        date: date,
    })
}

function findAllExercises(userId, limit) {


    return mongo.Exercise.find({ userId: userId }).limit(limit);

}

function findAllExercisesFromDate(userId, from, to, limit) {

    /*
    $gte y $lte son operadores de comparación en MongoDB que se utilizan para
    realizar consultas condicionales en campos numéricos o fechas.
    
    $gte: Significa "greater than or equal" (mayor o igual).
     Se utiliza para seleccionar documentos donde el valor del campo
     sea mayor o igual al valor proporcionado.
    
    $lte: Significa "less than or equal" (menor o igual).
     Se utiliza para seleccionar documentos donde el valor del campo sea menor
      o igual al valor proporcionado
    
    
    */

  if(isNaN(Date.parse(from))){

    return mongo.Exercise.find({
        userId: userId,
    })
        .limit(limit);
  }else{

     return mongo.Exercise.find({
        userId: userId,
        date: {
            $gte: new Date(from),
            $lte: new Date(to),
        }
    })
        .limit(limit);
  }
  
   

}



function findUserById(id) {

    return mongo.User.findById(id);
}

function getAllUsers() {

    return mongo.User.find();
}


module.exports = { save, createUser, findUserById, createExercise, getAllUsers, findAllExercises, findAllExercisesFromDate }