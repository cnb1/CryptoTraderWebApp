const userResolvers = require('./user');
const userPortfolio = require('./userportfolio');

module.exports = {
    Query: {
        ...userResolvers.Query,
        ...userPortfolio.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...userPortfolio.Mutation
    }
}