const User = require('../../models/user');

module.exports = {
    Query: {
        async getUsers() {
            try{
                const users = await User.find().sort({createdAt: -1});
                return users;
            }
            catch (err) {
                throw new Error(err);
            }
        }
    }
}