const ProductQueries = require('./queries');
const ProductMutation = require('./mutation');

let ProductResolvers = {
    queries:ProductQueries,
    mutation: ProductMutation
}

module.exports = ProductResolvers
