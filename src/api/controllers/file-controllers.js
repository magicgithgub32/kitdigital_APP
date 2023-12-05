const fs = require("fs").promises;
const requestKitDigital = require("../../scripts/requestKitDigital");
require("dotenv").config();

const processKitDigitalFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("No se ha subido correctamente el archivo.");
    }

    const filePath = req.file.path;

    const processingResult = await requestKitDigital(filePath);
    console.log("Processing Result:", processingResult);

    res.setHeader("Content-Type", "application/json");

    console.log("Attempting to delete file at:", filePath);
    try {
      await fs.unlink(filePath);
      console.log("File successfully deleted.");
    } catch (deleteError) {
      console.error("Error al eliminar el archivo:", deleteError);
    }

    res.json({
      success: true,
      message: "El archivo ha acabado de procesarse 😎",
      data: processingResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al procesar el archivo 🥺",
      error: error.message,
    });
  }
};

module.exports = { processKitDigitalFile };
