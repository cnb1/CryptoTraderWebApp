const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { createServer } = require("http");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const express = require("express");
const { split, HttpLink, ApolloClient } =require('@apollo/client');
const { getMainDefinition } =require('@apollo/client/utilities');
const { GraphQLWsLink } =require('@apollo/client/link/subscriptions');
const { createClient } =require('graphql-ws');
const fetch =require('cross-fetch');
const { MONGODB } = require("./config.js");


const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsLink =
    typeof window !== "undefined"
        ? new GraphQLWsLink(
                createClient({
                  url: 'ws://localhost:3005/graphql',
                })
          )
        : null;

const httpLink = new HttpLink({
    uri: 'http://localhost:3005/graphql', fetch
});

const link =
    typeof window !== "undefined" && wsLink != null
        ? split(
                ({ query }) => {
                    const def = getMainDefinition(query);
                    return (
                        def.kind === "OperationDefinition" &&
                        def.operation === "subscription"
                    );
                },
                wsLink,
                httpLink
          )
        : httpLink;

// const Appclient = new ApolloClient({
//     link,
//     cache: 'bounded',
// });

const app = express();
app.set('port', 3000);
const httpServer = createServer(app);


// console.log(httpServer);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  link,
  schema,
  csrfPrevention: true,
  cache: "bounded",
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("mongodb has connected");
    return server.start().then((res) => {
      server.applyMiddleware({ app });

      const PORT = 3005;

      httpServer.listen(PORT, () => {
        console.log(
          `Server is now running on http://localhost:${PORT}${server.graphqlPath}`
        );
      });
    });
  })
  .then((res) => {
    console.log(`server running `);
  });
