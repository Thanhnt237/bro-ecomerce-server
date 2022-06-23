const script_db = require("../../config/script_db");
let connection = require("../../config/database_connection");
const constants = require("../../common/constants")
const { request, gql , GraphQLClient} = require('graphql-request');
const multerUpload = require('../multer');
const multer = require('multer')

module.exports = {
  initDatabase: initDatabase,
  convertGPL: convertGPL,
  uploadFile: uploadFile
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