const path = require("path");
const multer = require("multer");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "../../uploads");

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadExcelFile = multer({ storage });
module.exports = uploadExcelFile;
