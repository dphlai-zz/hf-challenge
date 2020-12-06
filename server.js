//  -------------------------- CONNECT TO MONGODB -------------------------- //

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

const SERVER_SECRET_KEY = process.env.SERVER_SECRET_KEY
const checkAuth = () => {
  return jwtAuthenticate({
    secret: SERVER_SECRET_KEY,
    algorithms: ['HS256']
  });
}; // checkAuth

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

// CREATE
app.post('/recipes', async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    console.log('Query error:', err);
    res.status(500).json({error: err});
  }
}); // POST /recipes

app.post('/menus', async (req, res) => {
  try {
    const menu = new weeklyMenu(req.body);
    await menu.save();
    res.json(menu);
  } catch (err) {
    console.log('Query error:', err);
    res.status(500).json({error: err});
  }
}); // POST /menus

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    console.log('Query error:', err);
    res.status(500).json({error: err});
  }
})

// READ
app.get('/', async (req, res) => {
  try {
    res.json({'hello(fresh)':'world'})
  } catch (err) {
    console.log('Query error:', err);
    res.sendStatus(500).json({error: err});
  }
}); // GET /

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.log('Query error:', err);
    res.sentStatus(500).json({error: err})
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.id});
    res.json(user);
  } catch (err) {
    console.log('Query error:', err);
    res.sentStatus(500).json({error: err})
  }
});

app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.json(recipes);
  } catch (err) {
    console.log('Query error:', err);
    res.sentStatus(500).json({error: err})
  }
}); // GET /recipes

app.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({_id: req.params.id});
    res.json(recipe);
  } catch (err) {
    console.log('Query error:', err);
    res.sendStatus(500).json({error: err});
  }
}); // GET /recipes/:id

app.get('/menus', async (req, res) => {
  try {
    const weeklyMenus = await weeklyMenu.find({});
    res.json(weeklyMenus);
  } catch (error) {
    console.log('Query error:', err);
    res.sentStatus(500).json({error: err})
  }
}); // GET /menus

app.get('/menus/:id', async (req, res) => {
  try {
    const menu = await weeklyMenu.findOne({_id: req.params.id});
    res.json(menu);
  } catch (err) {
    console.log('Query error:', err);
    res.sendStatus(500).json({error: err});
  }
}); // GET /menus/:id

// UPDATE

// DESTROY
