const { gql } = require('apollo-server');

module.exports = gql`
type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    userportfolio: ID
}
type Price {
    price: Float!
    date: String!
}
type Portfolio {
    id: ID!
    username: String!
    strategy: String!
    value: Int!
    createdAt: String!
    valueHistory: [Price]!
}
input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
    userportfolio: ID
}
input PortfolioInput {
    userId: ID!
    username: String!
    strategy: String!
    userportfolio: ID
}
type Query {
    getUsers: [User]
    getPortfolios: [Portfolio]
    getPortfolio(portfolioId: ID!): Portfolio
}
type Mutation {
    registerUser(registerInput: RegisterInput): User!
    createUserPortfolio(userPortfolio: PortfolioInput): Portfolio!
    addPortfolio(userId: ID!, portfolioId: ID!): String!
    addPrice(price: Float!, portfolioId: ID!): Portfolio!
}
`;