const mongoose = require('mongoose');

const weeklyMenuSchema = new mongoose.Schema({
  week: Number,
  description: String,
  recipes: [{
    ref: 'Recipe',
    type: mongoose.Schema.Types.ObjectId
  }]
}) // weeklyMenuSchema

module.exports = mongoose.model('weeklyMenu', weeklyMenuSchema)
