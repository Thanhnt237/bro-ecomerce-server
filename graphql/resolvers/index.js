const databasesResolvers = require('./databases');
const loginResolvers = require('./login')
const categoriesResolvers = require('./categories')
const productResolvers = require('./product')
const sellerResolvers = require('./Seller')

const resolvers = {
  Query: {
    ...databasesResolvers.queries,
    ...loginResolvers.queries,
    ...categoriesResolvers.queries,
    ...productResolvers.queries,
    ...sellerResolvers.queries,

  },
  Mutation: {
    ...databasesResolvers.mutation,
    ...loginResolvers.mutation,
    ...categoriesResolvers.mutation,
    ...productResolvers.mutation,
    ...sellerResolvers.mutation,

  }
};

module.exports = resolvers;
