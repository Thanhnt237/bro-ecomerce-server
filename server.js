let express = require("express");
let loggger = require("morgan");
let bodyParser = require('body-parser')
const graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');
let logger = require("./utils/logger");

const graphqlServer = require('./graphql');
require('dotenv').config();
let app = express();

app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true,parameterLimit: 50000 }));

app.use('/', require('./REST/routes'));
app.use('/media', express.static('assets/upload'));
app.use(loggger("dev"));
app.use(graphqlUploadExpress());
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
