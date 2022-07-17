const databasesResolvers = require('./databases');
const loginResolvers = require('./user')
const categoriesResolvers = require('./categories')
const productResolvers = require('./product')
const sellerResolvers = require('./Seller')
const voucherResolvers = require('./voucher')
const paypalResolvers = require('./paypal')
const uploadResolvers = require('./upload')
const cartResolvers = require('./cart');

const GraphQLUpload = require('graphql-upload/GraphQLUpload.js');

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    ...databasesResolvers.queries,
    ...loginResolvers.queries,
    ...categoriesResolvers.queries,
    ...productResolvers.queries,
    ...sellerResolvers.queries,
    ...voucherResolvers.queries,
    ...paypalResolvers.queries,
    ...uploadResolvers.queries,
    ...cartResolvers.queries,
  },
  Mutation: {
    ...databasesResolvers.mutation,
    ...loginResolvers.mutation,
    ...categoriesResolvers.mutation,
    ...productResolvers.mutation,
    ...sellerResolvers.mutation,
    ...voucherResolvers.mutation,
    ...paypalResolvers.mutation,
    ...uploadResolvers.mutation,
    ...cartResolvers.mutation,
  }
};

module.exports = resolvers;
