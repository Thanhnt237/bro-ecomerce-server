const databasesQueries = require('./queries');
const databasesMutation = require('./mutation');

let databasesResolvers = {
    queries: databasesQueries,
    mutation: databasesMutation
}

module.exports = databasesResolvers
