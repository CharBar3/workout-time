
require('dotenv').config()

//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require ('mongoose');
const app = express();
const db = mongoose.connection;

// requires workout model
const Workout = require('./models/workout.js')

//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI , { useNewUrlParser: true, useUnifiedTopology: true }
);

// Error / success
db.on('error', (err) => console.log(err.message + ' is mongodb not running?'));
db.on('connected', () => console.log('mongodb connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongodb disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Controllers
//___________________

const dashboardController = require('./controllers/dashboard')
app.use('/dashboard', dashboardController)

//___________________
// Routes
//___________________
//localhost:3000

// Seed Route
const seedWorkouts = require('./models/seedWorkouts.js')
app.get('/seed', (req, res) => {
  Workout.deleteMany({}, (error, allWorkouts) => {})
  Workout.create(seedWorkouts, (error, data) => {
    res.redirect('/')
  })
})



app.get('/' , (req, res) => {
  res.redirect('/dashboard')
});
 
//___________________
//Listener
//___________________
app.listen(PORT, () => console.log('express is listening on:', PORT));
