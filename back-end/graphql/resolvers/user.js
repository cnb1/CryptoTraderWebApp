const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const User = require('../../models/user');

const {validateRegisterInput, validateLoginInput} = require ('../../util/validators');
const { SECRET_KEY } = require('../../config');

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.Dateemail,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h'});
}

module.exports = {
    Mutation: {
        async registerUser(_, {
                registerInput: {username, email, password, confirmPassword}
            }
        ) {
            
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);

            if (!valid) {
                throw new UserInputError('Errors', {errors});
            }


            const user = await User.findOne({ username});

            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }

            // TODO hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }

        },
        async addPortfolio(_, { userId, portfolioId }) {
            console.log(userId);

            await User.updateOne({_id: userId}, {
                userportfolio:  portfolioId
            })

            return portfolioId
        },
        async login(_, {username, password}){

            const {errors, valid} = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('Errors', {errors});
            }

            const user = await User.findOne({username});

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors});
            }


            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong Credentials', {errors});
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
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
        },
        async getUser(_, {userId}) {
            const user = await User.findById(userId);

            if (user) {
                return user;
            }
            else {
                throw new UserInputError("User doesnt exitst");
            }
        }
    }
}