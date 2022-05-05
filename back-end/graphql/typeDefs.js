const { gql } = require('apollo-server');

module.exports = gql`
type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    id2: ID!
}
input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
}
type Query {
    getUsers: [User]
}
type Mutation {
    registerUser(registerInput: RegisterInput): User!
}
`;