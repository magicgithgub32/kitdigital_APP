const {
  closeContext,
  initContext,
  delay,
  selectGotByText,
  initContextWithDialogHandler,
  handleIframe,
  tipoDeSegmento,
  codigoSegmentoToClick,
} = require("./robodec");

const { exec } = require("child_process");
const fs = require("fs");
const request = require("request");
const { chromium } = require("playwright");
const path = require("path");

const runAppleScript = () => {
  return new Promise((resolve, reject) => {
    exec("osascript ./handleDialog.scpt", (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    });
  });
};

const requestBono_URL =
  "https://sede.red.gob.es/convocatorias-y-ayudas?field_fecha_fin_plazo_value=1";

const requestBono = async () => {
  let customer = {
    Num_trabajadores: "Menos de 3 trabajadores",
  };

  /*try {
    const { page, browser } = await initContextWithDialogHandler({
      url: requestBono_URL,
    });
    */

    try {
      const { page, browser } = await initContext({
        url: requestBono_URL,
      });

    // const browser = await chromium.launch({ headless: false });
    // const context = await browser.newContext();

    // context.route("**/*", (route, req) => {
    //   const options = {
    //     uri: req.url(),
    //     method: req.method(),
    //     headers: req.headers(),
    //     body: req.postDataBuffer(),
    //     timeout: 10000,
    //     followRedirect: false,
    //     agentOptions: {
    //       pfx: fs.readFileSync("./certs/user_cert.p12"),
    //     },
    //   };

    //   let firstTry = true;
    //   const handler = function handler(err, resp, data) {
    //     if (err) {
    //       if (firstTry) {
    //         firstTry = false;
    //         return request(options, handler);
    //       }
    //       console.error(`Unable to call ${options.uri}`, err.code, err);
    //       return route.abort();
    //     } else {
    //       return route.fulfill({
    //         status: resp.statusCode,
    //         headers: resp.headers,
    //         body: data,
    //       });
    //     }
    //   };

    //   request(options, handler);
    // });

    // const page = await context.newPage();
    // await page.goto(
    //   "https://sede.red.gob.es/convocatorias-y-ayudas?field_fecha_fin_plazo_value=1"
    // );

    
    let segmento = tipoDeSegmento(customer)

    await codigoSegmentoToClick(page, segmento, delay)

    await page.getByRole("link", { name: "Acceder al trámite" }).click();
    await delay(2000);

    await page
      .getByRole("group", { name: "Acceso mediante certificado" })
      .getByRole("button")
      .click();

      page.on("dialog", async (dialog) => {
        console.log(dialog.message())
        await dialog.accept()
      })

      //await page.goto('https://sedepkd.red.gob.es/oficina/wizard/wizard.do');

    await delay(25000);

    const frame = await handleIframe(page, ".iframeTasks");

    await frame.selectOption(
      '[id="formRenderer:soli_empresa_autoempleo"]',
      "autoempleo"
    );
    await delay(2000);

    await frame.selectOption(
      '[id="formRenderer:representante_tipo"]',
      "Representante voluntario"
    );
    await delay(2000);

    await frame.selectOption(
      '[id="formRenderer:representante_tipo_voluntario"]',
      "Persona Física"
    );
    await delay(2000);

    const basePath = path.join(
      "Users",
      "Ruben",
      "Desktop",
      "DECLARANDO 2",
      "RPA",
      "kitdigital",
      "Autoriza_Representante_Voluntario"
    );

    const customerFileName = `REPVOL${customer.NIF_NIE}.pdf`;

    const filePath = path.join(basePath, customerFileName);

    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (err) {
        console.error("Cannot read the file:", err);
      } else {
        console.log("File is readable.");
      }
    });

    await frame.setInputFiles(
      "#formRenderer\\:file_C02201_C022SO\\:file",
      filePath
    );

    await selectGotByText(frame, "Siguiente");

    // }

    await closeContext(browser);

    return { success: true, message: "Bono requested succesfully", customer };
  } catch (error) {
    console.error("Error during bono request:", error);
    return { success: false, message: "Bono request failed", customer };
  }
};

requestBono();

/*
module.exports = requestBono
*/
