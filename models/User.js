const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  passwordDigest: String,
  ratings: [{
    ref: 'Recipe',
    type: mongoose.Schema.Types.ObjectId,
    rating: Number
  }]
}); // userSchema

module.exports = mongoose.model('User', userSchema)
