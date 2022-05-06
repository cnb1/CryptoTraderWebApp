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
type Portfolio {
    id: ID!
    username: String!
    strategy: String!
    value: Int!
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
}
type Mutation {
    registerUser(registerInput: RegisterInput): User!
    createUserPortfolio(userPortfolio: PortfolioInput): Portfolio!
    addPortfolio(userId: ID!, portfolioId: ID!): String!
}
`;