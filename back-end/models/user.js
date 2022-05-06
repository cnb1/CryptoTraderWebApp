const {model, Schema} = require('mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    userportfolio: {
        type: Schema.Types.ObjectId,
        ref: 'userportfolios'
    }
});

module.exports = model('user', userSchema);