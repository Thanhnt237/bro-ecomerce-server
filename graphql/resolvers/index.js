const databasesResolvers = require('./databases');
const loginResolvers = require('./login')
const categoriesResolvers = require('./categories')
const productResolvers = require('./product')
const sellerResolvers = require('./Seller')
const voucherResolvers = require('./voucher')
const paypalResolvers = require('./paypal')

const resolvers = {
  Query: {
    ...databasesResolvers.queries,
    ...loginResolvers.queries,
    ...categoriesResolvers.queries,
    ...productResolvers.queries,
    ...sellerResolvers.queries,
    ...voucherResolvers.queries,
    ...paypalResolvers.queries,
  },
  Mutation: {
    ...databasesResolvers.mutation,
    ...loginResolvers.mutation,
    ...categoriesResolvers.mutation,
    ...productResolvers.mutation,
    ...sellerResolvers.mutation,
    ...voucherResolvers.mutation,
    ...paypalResolvers.mutation,
  }
};

module.exports = resolvers;
