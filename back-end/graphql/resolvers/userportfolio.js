const { UserInputError } = require('apollo-server-express');
const UserPortfolio = require('../../models/userportfolio');
const Stragety = require('../../models/strategy');
const userResolvers = require('./user');
const pubsub = require('../pubsub.js');


module.exports = {
    Mutation: {
        async createUserPortfolio (_, 
            {
                userPortfolio: {userId, username, strategy, userportfolio}
            }) {

                console.log("create user portfolio ...")

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
        async addPrice(_, {price, portfolioId}, context) {

            const portfolio = await UserPortfolio.findById(portfolioId);

            if (portfolio) {
                portfolio.valueHistory.push({
                    price,
                    date: new Date().toISOString()
                })

                // pubsub.publish('NEW_PRICE', {
                //     newPrice: portfolio
                // });

                return portfolio.save().
                then(result=> {
                    console.log('subscription trigger')
                    pubsub.publish('GET_PORTFOLIO', {
                        addPrice: portfolio
                    });
                    // console.log(pubsub);
                    return portfolio;
                })
                .catch(err => {
                    console.error(err);
                });
            }
            else {
                throw new UserInputError('Portfolio not found')
            }
        },
        async updateStrategy(_, {strategy, portfolioId}) {
            const portfolio = await UserPortfolio.findById(portfolioId);

            if (portfolio) {
                portfolio.strategy = strategy;
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

        },
        async getStrategys() {
            try {
                const strategys = await Stragety.find();
                return strategys;
            }
            catch (err) {
                throw Error(err);
            }
         }
    }
}