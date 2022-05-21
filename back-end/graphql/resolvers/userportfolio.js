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
            

            const newPortfolio = new UserPortfolio({
                username,
                strategy,
                userId,
                createdAt: new Date().toISOString(),
                valueHistory: {
                    price: 0.0,
                    date: new Date().toISOString()
                }
            })

            const portfolio = await newPortfolio.save();

            console.log(userId);
            console.log(portfolio.id);

            // add the portfolio id to the user document
            userResolvers.Mutation.addPortfolio(_, {userId: userId, portfolioId: portfolio.id});

            return portfolio;
        },
        async addPrice(_, {price, portfolioId}) {

            const portfolio = await UserPortfolio.findById(portfolioId);

            if (portfolio) {
                portfolio.valueHistory.push({
                    price,
                    date: new Date().toISOString()
                })

                await portfolio.save();
                return portfolio;
            }
            else {
                throw new UserInputError('Portfolio not found')
            }
        }
    },
    Query: {
        async getPortfolios() {
            try {
                const portfolios = await UserPortfolio.find();
                return portfolios;
            }
            catch (err) {
                throw Error(err);
            }
        },
        async getPortfolio(_, {portfolioId}) {

            const portfolio = await UserPortfolio.findById(portfolioId);

            if (portfolio) {
                return portfolio;
            }
            else {
                throw new UserInputError("Portfolio doesnt exitst");
            }

        }
    }
}