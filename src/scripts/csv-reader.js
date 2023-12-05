const fs = require("fs");
const fastcsv = require("fast-csv");

const readCsv = async (fileName) => {
  return new Promise((resolve, reject) => {
    try {
      const jsonDataArray = [];
      fs.createReadStream(fileName)
        .pipe(fastcsv.parse({ headers: true, delimiter: ";" }))
        .on("data", (row) => {
          jsonDataArray.push(row);
        })
        .on("end", () => {
          resolve(jsonDataArray);
        })
        .on("error", (error) => {
          reject(error);
        });
    } catch (error) {
      console.error("Error reading CSV file:", error);
      reject(error);
    }
  });
};

module.exports = { readCsv };
