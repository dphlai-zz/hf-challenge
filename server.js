//  -------------------- CONNECT TO MONGODB -------------------------------  //

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtAuthenticate = require('express-jwt');
const Recipe = require('./models/Recipe');
const User = require('./models/User');
const weeklyMenu = require('./models/weeklyMenu');
const dotenv = require('dotenv').config();

// connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); // mongoose.connect()

const db = mongoose.connection;

// check whether connection has succeeded or failed
db.once('open',  () => console.log('Connected:', process.env.MONGO_URI)); // db.once()
db.on('error', err => {
  conole.error('Connection error:', err)
}); //db.on()

//  -------------------- EXPRESS SERVER INITIALISATION --------------------  //

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended: true}));

// initialise server that browser can connect to
app.listen(3000, () => console.log('Listening on 3000'));

// -------------------------------- ROUTES --------------------------------  //

app.get('/', (req, res) => {
  res.send({'hello':'world'})
})
