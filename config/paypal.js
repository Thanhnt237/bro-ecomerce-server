const paypal = require('paypal-rest-sdk')

const client_id = process.env.PAYPAL_CLIENT_ID;
const secret = process.env.PAYPAL_SECRET;

//configure for sandbox environment
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': client_id,
    'client_secret': secret
});

module.exports = paypal;