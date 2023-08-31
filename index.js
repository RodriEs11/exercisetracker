const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");

const mongo = require("./mongo");
const service = require("./service");

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', (req, res) => {

  res.sendFile(__dirname + '/views/index.html')
});


app.post("/api/users", async (req, res) => {

  const user = service.createUser(req.body.username);
  await service.save(user);

   console.log("POST /api/user: " + user.username);
  res.json(user);

 

})
  .get("/api/users", (req, res) => {


    //RETORNA LA PROMISE EN UN JSON OBJECT/*
    service.getAllUsers().lean().exec().then((users) => {

      const array = Object.values(users)
      res.send(array)

    })

  })


app.post("/api/users/:id/exercises", async (req, res) => {

  const userId = req.params.id;
  const description = req.body.description;
  const duration = req.body.duration;
  let date = req.body.date

  
 console.log({
   userId: userId,
   description: description,
   duration: duration,
   date: date,
 });
  const user = await service.findUserById(userId);

  if (isNaN(Date.parse(date))) {
    //FECHA INVALIDA -> FECHA ACTUAL
    date = new Date(Date.now())
  } else {
    date = new Date(date);
  }


  
  const exercise = service.createExercise(description, duration, date, user);
  await service.save(exercise);


  const json = {
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: new Date(exercise.date).toDateString(),
    _id: user._id
  }

  res.json(json);



})

app.get("/api/users/:id/logs", async (req, res) => {

  const userId = req.params.id;
  const user = await service.findUserById(userId);

  const dateFrom = new Date(req.query.from);
  const dateTo = new Date(req.query.to);
  const limit = req.query.limit ?? 200;

  let exercises = null;

  if (isNaN(Date.parse(dateFrom))) {

    exercises = await service.findAllExercises(userId, limit).lean().exec().then((exercises) => {
      return Object.values(exercises)

    })

  } else {

    exercises = await service.findAllExercisesFromDate(userId, dateFrom, dateTo, limit).lean().exec().then((exercises) => {
      return Object.values(exercises)
    })
  }


  const exercisesMap = exercises.map((exercise) => {

    //RETORNA NUEVO JSON CON LOS DATOS NECESARIOS
    return {
      description: exercise.description,
      duration: exercise.duration,
      date: new Date(exercise.date).toDateString()
    }

  })

  const count = exercisesMap.length

  const userLog = {
    username: user.username,
    count: count,
    _id: user._id,
    log: exercisesMap
  }

  res.json(userLog);

})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


