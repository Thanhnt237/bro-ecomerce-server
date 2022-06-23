var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/device-log`)
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "-" + file.originalname)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        cb(null, true)
    }
}).single("files");


module.exports = {
    upload: upload
}