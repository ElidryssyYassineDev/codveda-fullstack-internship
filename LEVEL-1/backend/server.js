require('dotenv').config();

require('dns').setServers(['1.1.1.1', '8.8.8.8']);

const http = require('http');
const { ApolloServer } = require('@apollo/server');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { expressMiddleware } = require('@as-integrations/express5');
// ↑ swap to '@as-integrations/express5' if npm list express showed v5

const app = require('./src/app');
const connectDB = require('./src/config/db');
const initSocket = require('./src/socket/socket');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers = require('./src/graphql/resolvers');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server, app);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  // Lets Apollo finish any in-flight GraphQL request cleanly if the
  // server ever shuts down, instead of cutting it off mid-response.
  // Standard practice in every current Apollo + Express setup, not
  // specific to anything in this project.
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer: server })],
});

connectDB().then(async () => {
  await apolloServer.start();
  app.use('/graphql', expressMiddleware(apolloServer));

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
});