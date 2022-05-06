const {model, Schema} = require('mongoose');

const userPortfolioSchema = new Schema({
    username: String,
    strategy: String,
    value: Number
});

module.exports = model('userportfolio', userPortfolioSchema);