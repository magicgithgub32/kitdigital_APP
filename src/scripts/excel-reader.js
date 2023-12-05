const XLSX = require("xlsx");

const readXlx = (filePath) => {
  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[sheetName];

  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  return jsonData;
};

module.exports = readXlx;
