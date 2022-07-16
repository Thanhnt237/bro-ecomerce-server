const loginQueries = require('./queries');
const loginMutation = require('./mutation');

let loginResolvers = {
    queries: loginQueries,
    mutation: loginMutation
}

module.exports = loginResolvers
