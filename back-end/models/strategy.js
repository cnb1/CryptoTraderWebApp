const {model, Schema} = require('mongoose');

const strategySchema = new Schema({
    strategy: String
});

module.exports = model('strategy', strategySchema);