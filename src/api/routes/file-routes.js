const express = require("express");
const router = express.Router();
const { processKitDigitalFile } = require("../controllers/file-controllers");
const uploadExcelFile = require("../middlewares/uploadExcelFile-middleware");

router.post(
  "/upload",
  uploadExcelFile.single("excelFile"),
  processKitDigitalFile
);

module.exports = router;
