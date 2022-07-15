let express = require("express");
let loggger = require("morgan");
let bodyParser = require('body-parser')

let logger = require("./utils/logger");

const graphqlServer = require('./graphql');
require('dotenv').config();
let app = express();

app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true,parameterLimit: 50000 }));

app.use('/', require('./REST/routes'));
app.use(loggger("dev"));

const start = async () => {
  try {
    await graphqlServer.start()
    graphqlServer.applyMiddleware({
      app,
      path: '/resource'
    });
    app.listen(process.env.SERVER_PORT, ()=>{
      logger.info("Express server listening on port " + process.env.SERVER_PORT);
    });
  } catch(error) {
    console.log(error);
  }
};

start();
