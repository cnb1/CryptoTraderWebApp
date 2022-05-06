const { UserInputError } = require('apollo-server');
const UserPortfolio = require('../../models/userportfolio');
const userResolvers = require('./user');

module.exports = {
    Mutation: {
        async createUserPortfolio (_, 
            {
                userPortfolio: {userId, username, strategy, userportfolio}
            }) {

            if (userportfolio) {
                throw new UserInputError('Portfolio exists');
            }
            else {
                console.log('portfolio id doesnt exitst')
            }
            
            // console.log(username);
            // const por = await UserPortfolio.findOne({username});

            // if (por) {
            //     throw new UserInputError('Portfolio with username exists');
            // }
            // else {
            //     console.log("username doesnt exist")
            // }

            

            const newPortfolio = new UserPortfolio({
                username,
                strategy
            })

            const portfolio = await newPortfolio.save();

            console.log(userId);
            console.log(portfolio.id);

            userResolvers.Mutation.addPortfolio(_, {userId: userId, portfolioId: portfolio.id});

            return portfolio;
        }
    }
}