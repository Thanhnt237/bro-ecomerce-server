const script_db = require("../../config/script_db");
let connection = require("../../config/database_connection");
const constants = require("../../common/constants")
const { request, gql , GraphQLClient} = require('graphql-request');
const multerUpload = require('../multer');
const multer = require('multer')
const paypal = require('../../config/paypal')
const tensor = require('../../tensorflow/index')

module.exports = {
  initDatabase: initDatabase,
  convertGPL: convertGPL,
  uploadFile: uploadFile,
  createPaypalSDK: createPaypalSDK,
  predictProduct: predictProduct,
  testPredict: testPredict
};

async function initDatabase(req, res) {
  let string_script = script_db; //.replace(/\n/g, ' ');
  string_script = string_script.replace(/\t/g, " ");
  console.log(string_script);
  // console.log(connection);
  try {
    const [rows, fields] = await connection.query(string_script);
    result = rows;
    res.status(200).send(result);
  } catch (error) {
    console.log("error" + error);
    res.status(401).send(error);
  }
}

async function convertGPL(req, res){
  const endpoint = process.env.ENDPOINT

  let graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: 'Bearer MY_TOKEN',
    }
  });


  let body = req.body.gpl.replace(/\"/g, '"');
  let request = gql`${body}`;

   // console.log(request)
   const results = await graphQLClient.request(request);
   // console.log(JSON.stringify(results))
  if(results.ClientError){
    res.status(400).send(results.ClientError)
  }else{
    res.status(200).send(results);
  }
  };

  // const data = await request(endpoint, query)
  // console.log(JSON.stringify(data))

async function test(req, res) {
    console.log("SADSADASDASD");
}

async function uploadFile(req,res) {
  await multerUpload.upload(req,res, (err)=>{
    if (err instanceof multer.MulterError) {
      console.log(err);
      res.status(403).JSON({status: "KO", message: "A Multer error occurred when uploading."})
    }else if (err) {
      console.log(err);
      res.status(403).send({status: "KO", message: "A Multer error occurred when uploading."})
    }else{
      console.log("Upload is okay");
      res.status(200).send({status: "OK", message: "OK"})
    }
  })
}

async function createPaypalSDK(req, res){
  let card_data = {
    "intent": "sale",
    "payer": {
      "payment_method": "credit_card",
      "funding_instruments": [{
        "credit_card": {
          "type": "visa",
          "number": "4032033177759185",
          "expire_month": "08",
          "expire_year": "2027",
          "cvv2": "762",
          "first_name": "Joe",
          "last_name": "Shopper",
          "billing_address": {
            "line1": "52 N Main ST",
            "city": "Johnstown",
            "state": "OH",
            "postal_code": "43210",
            "country_code": "US"
          }}}]},
    "transactions": [{
      "amount": {
        "total": "0.00001",
        "currency": "USD",
        "details": {
          "subtotal": "0.00000001",
          "tax": "0",
          "shipping": "0"}},
      "description": "This is the payment transaction description."
    }]};
  console.log(paypal)
  paypal.payment.create(card_data, function(error, payment){
    if(error){
      console.error(error);
      res.status(400).json({status: "KO", ...error})
    } else {
      console.log(payment);
      res.status(200).json({status: "OK", ...payment})
    }
  });
}

async function testPredict(req, res){
  let {currentLocation} = req.body
  if(!currentLocation || currentLocation === "") currentLocation = '{"lat":21.009564,"lng":105.80800}'
  await tensor.predict.predictByGeolocation(currentLocation)
}

async function predictProduct(req, res){
  let {currentLocation} = req.body
  if(!currentLocation || currentLocation === "") currentLocation = '{"lat":21.009564,"lng":105.80800}'

  let result = []
  result = await tensor.predict.predictByGeolocation(currentLocation)

  res.status(200).json({result: [result]})
}