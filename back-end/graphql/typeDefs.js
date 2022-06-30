const { gql } = require('apollo-server-express');

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
    id: ID!
    price: Float!
    date: String!
}
type Strategy {
    id: ID!
    strategy: String!
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
    getUser(userId: ID!): User!
    getStrategys: [Strategy]
}
type Mutation {
    registerUser(registerInput: RegisterInput): User!
    createUserPortfolio(userPortfolio: PortfolioInput): Portfolio!
    addPortfolio(userId: ID!, portfolioId: ID!): String!
    addPrice(price: Float!, portfolioId: ID!): Portfolio!
    login(username: String!, password: String!): User!
    updateStrategy(strategy: String!, portfolioId: ID!): Portfolio!
}

type Subscription {
    addPrice: Portfolio
}

`;