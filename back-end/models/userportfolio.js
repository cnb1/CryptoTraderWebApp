const {model, Schema} = require('mongoose');

const userPortfolioSchema = new Schema({
    username: String,
    strategy: String,
    value: Number,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    valueHistory: [
        {
            price: Number,
            date: Date
        }
    ]
});

module.exports = model('userportfolio', userPortfolioSchema);