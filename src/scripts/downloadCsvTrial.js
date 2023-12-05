const { chromium } = require("playwright");
const { delay } = require("./robodec");
const fs = require("fs");
require("dotenv").config();

const excel_URL =
  "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1ODzZO_PtAknxxQy6L9jcIfB-tF5guuR-KbMRprmPOuk%2Fedit&followup=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1ODzZO_PtAknxxQy6L9jcIfB-tF5guuR-KbMRprmPOuk%2Fedit&ifkv=ASKXGp0JivOTkdl_THJP9KNyvSucpHPnrKSeZbfTPyWqY0LM2X68_LfLAAlk9FHK0LfvGlDcp9EUUA&ltmpl=sheets&osid=1&passive=1209600&service=wise&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-988917334%3A1700560536268149&theme=glif#gid=1135345634";

const downloadCsvTrial = async () => {
  try {
    const browser = await chromium.launch({ headless: false });

    const context = await browser.newContext({
      //   downloadsPath: `ruben@Rubens-MacBook-Pro-2/desktop/downloaded-file.csv`,
    });

    const page = await context.newPage();

    await page.goto(excel_URL);

    await page.getByLabel("Email or phone").click();
    await page.getByLabel("Email or phone").fill("ruben.piqueras@visma.com");
    await delay(2000);
    await page.getByRole("button", { name: "Next" }).click();
    await delay(2000);
    await page.getByLabel("Enter your password").fill(process.env.MY_PASSWORD);
    await page.getByRole("button", { name: "Next" }).click();
    await delay(2000);
    await page.getByRole("button", { name: "OUTPUT" }).click();
    await delay(2000);
    await page
      .getByLabel("Menu bar")
      .getByRole("menuitem", { name: "File" })
      .click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByLabel("Comma-separated values (.csv) c").click();
    const download = await downloadPromise;
    await delay(2000);
    const path = await download.path();
    console.log("Downloaded file path:", path);

    await delay(5000);

    if (fs.existsSync(path)) {
      console.log("File exists, ready to read.");
    } else {
      console.error("File does not exist at the path.");
    }
    await browser.close();

    return path;
  } catch (error) {
    console.log("Error downloading excel file: " + error);
    return {
      success: false,
      message: "Excel file not downloaded successfully",
    };
  }
};

// downloadCsvTrial();

module.exports = downloadCsvTrial;
