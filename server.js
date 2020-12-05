const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const dotenv = require('dotenv').config();
const app = express();

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

// initialise server that browser can connect to
app.listen(3000, () => console.log('Listening on 3000'));

app.get('/', (req, res) => {
  res.send({'hello':'world'})
})
