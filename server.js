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

// checkAuth() would be passed into each CRUD route as a second parameter
// e.g. app.get('/', checkAuth(), async (req, res) => {})
const checkAuth = () => {
  return jwtAuthenticate({
    secret: SERVER_SECRET_KEY,
    algorithms: ['HS256']
  });
}; // checkAuth

const SERVER_SECRET_KEY = process.env.SERVER_SECRET_KEY

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

app.post('/login/users', async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if (!user) {
      return res.status(401).json({error: 'Login failed! Check authentication credentials.'});
    } // if

    if (user && bcrypt.compareSync(password, user.passwordDigest)) {
      const token = await jwt.sign(
        {
          _id: user._id,
          email: user.email,
          name: user.firstName
        },
        SERVER_SECRET_KEY,
        {expiresIn: '72h'}
      ); // jwt.sign()

      res.json({
        user: {
          name: user.firstName
        },
        token,
        success: true
      });
    } else {
      return res.json({error: 'Incorrect password.'});
    } // if else
  } catch (err) {
    res.status(500).json({error:err});
  }
});
// curl -XPOST -d '{"email":"danny@email.com", "password":"chicken"}' http://localhost:3000/login/users -H 'content-type: application/json'

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
app.patch('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body);
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    console.log('Query error:', err);
    res.status(500).json({error: err});
  }
}); // PATCH /recipes/:id

app.patch('/menus/:id', async (req, res) => {
  try {
    const menu = await weeklyMenu.findByIdAndUpdate(req.params.id, req.body);
    await menu.save();
    res.json(menu);
  } catch (err) {
    console.log('Query error:', err);
    res.status(500).json({error: err});
  }
}); // PATCH /menus/:id

app.patch('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    console.log('Query error:', err);
    res.status(500).json({error: err});
  }
}); // PATCH /users/:id

// DESTROY
app.delete('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if(!recipe) res.status(404).json({notFound: true});
    res.status(200).json({success: true});
  } catch (err) {
    res.status(500).json({error: err});
  }
}); // DELETE /recipes/:id

app.delete('/menus/:id', async (req, res) => {
  try {
    const menu = await weeklyMenu.findByIdAndDelete(req.params.id);
    if(!menu) res.status(404).json({notFound: true});
    res.status(200).json({success: true});
  } catch (err) {
    res.status(500).json({error: err});
  }
}); // DELETE /menus/:id

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) res.status(404).json({notFound: true});
    res.status(200).json({success: true});
  } catch (err) {
    res.status(500).json({error: err});
  }
}); // DELETE /users/:id
