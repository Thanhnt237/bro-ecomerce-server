const { ApolloServer, AuthenticationError, UserInputError } = require('apollo-server-express');
const constants = require("../common/constants");
const schema = require('./schema');
let { verifyToken } = require('./middleware/auth')

const apolloServer = new ApolloServer({
  introspection: true,
  schema,
  playground: process.env.ENVIRONMENT,
  // csrfPrevention: true,
  // context: async ({ req }) => {
    //
    // let isPublicAPI = false;
    //
    // if(!req.body.query) throw new UserInputError('No query')
    //
    // constants.PUBLIC_FUNCTION.forEach(item => {
    //   if(req.body.query.includes(item)){
    //     isPublicAPI = true;
    //     return null;
    //   }
    // })
    //
    // if(isPublicAPI) return null;
    //
    // const token = req.headers.authorization || '';
    // if (!token) throw new AuthenticationError('Invalid token');
    //
    // try {
    //   return await verifyToken(token)
    // }catch(error){
    //   throw error
    // }
  // },
});

module.exports = apolloServer;
