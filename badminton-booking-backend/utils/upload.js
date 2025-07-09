const multer = require("multer");
const fs = require("fs");
const path = require("path");

const DIR_UPLOADS = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(DIR_UPLOADS)) {
  fs.mkdirSync(DIR_UPLOADS);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR_UPLOADS);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${file.fieldname}-${Date.now()}.${file.originalname.split('.').pop()}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;