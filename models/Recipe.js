const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [
    name: String
  ],
  allergens: [
    name: String
  ],
  preparationTime: String,
  cookingDifficulty: String,
  ingredients: [
    {
      name: String,
      measurement: String
    }
  ],
  nutritionalValue: [
    energy: Number,
    fat: Number,
    ofWhichSaturates: Number,
    carbohydrates: Number,
    ofWhichSugars: Number,
    dietaryFibre: Number,
    protein: Number,
    cholestrol: Number,
    sodium: Number
  ],
  utensils: [
    name: String
  ],
  instructions: [
    step: String
  ]
}); // recipeSchema

module.exports = mongoose.model('Recipe', recipeSchema);
