const express = require("express");
const router = express.Router();
const {
  processKitDigitalFile,
  processRequestBono,
} = require("../controllers/file-controllers");
const uploadExcelFile = require("../middlewares/uploadExcelFile-middleware");

router.post(
  "/upload",
  uploadExcelFile.single("excelFile"),
  processKitDigitalFile
);

router.post(
  "/processRequestBono",
  uploadExcelFile.single("excelFile"),
  processRequestBono
);

module.exports = router;
