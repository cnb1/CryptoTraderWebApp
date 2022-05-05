const { UserInputError } = require('apollo-server');
const User = require('../../models/user');

module.exports = {
    Mutation: {
        async registerUser(_, {
                registerInput: {username, email, password, confirmPassword}
            }
        ) {

            const user = await User.findOne({username});

            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }

            const newUser = new User({
                username,
                email,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();


            return {
                ...res._doc,
                id: res._id
            }

        }
    },
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