const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const {MONGODB} = require('./config.js');


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
        return {req, res}
    }
}
);

mongoose.connect(MONGODB, {useNewUrlParser: true})
    .then(() => {
        console.log('mongodb has connected');
        return server.listen({port:3005});
    })
    .then((res) => {
    console.log(`server running at ${res.url}`);
});