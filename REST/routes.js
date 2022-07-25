var express = require("express");
var router = express.Router();

const controller = require("./controller");

router.post("/database/initDatabase", controller.initDatabase)
router.post("/rest-api/convertGPL", controller.convertGPL)
// router.post("/file/upload", controller.uploadFile)
router.post("/api/paypal/create", controller.createPaypalSDK)

router.post("/api/tensorflow/predictProduct", controller.predictProduct)
router.post("/api/tensorflow/test", controller.testPredict)
module.exports = router;
