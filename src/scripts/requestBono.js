const {
  closeContext,
  initContext,
  delay,
  handleIframe,
  codigoSegmentoToClick,
  tipoDeSegmento,
  tipoDeSolicitante,
  tipoDeSolicitanteToSelect,
  getCustomerProvinciaForRequestBono,
  tieneEmpresasFunction,
  selectGotByRole,
  selectGotByOptionInFrame,
  fillByLabelInFrame,
  selectMenuGotByLabelInFrame,
  selectGotByRoleInFrame,
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
    Nombre: "Amparo Ruiz",
    Tlf: "666333777",
    Email: "amparoruiz@gmail.com",
    Num_trabajadores: "Menos de 3 trabajadores",
    NIF_NIE: "20473233J",
    Localidad: "Azaila//Teruel//Aragón",
  };

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

    const segmento = tipoDeSegmento(customer);

    await codigoSegmentoToClick(page, segmento, delay);

    await selectGotByRole(page, "link", "Acceder al trámite");

    await page
      .getByRole("group", { name: "Acceso mediante certificado digital." })
      .getByRole("button")
      .click();

    page.on("dialog", async (dialog) => {
      console.log("dialog", dialog.message());
      await dialog.accept();
    });

    // await runAppleScript();

    const frame = await handleIframe(page, ".iframeTasks");

    const solicitante = tipoDeSolicitante(customer);

    await tipoDeSolicitanteToSelect(
      frame,
      '[id="formRenderer:soli_empresa_autoempleo"]',
      solicitante
    );

    await selectGotByOptionInFrame(
      frame,
      '[id="formRenderer:representante_tipo"]',
      "Representante voluntario"
    );

    await selectGotByOptionInFrame(
      frame,
      '[id="formRenderer:representante_tipo_voluntario"]',
      "Persona Física"
    );

    const basePath = path.join(
      "/Users",
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

    await frame.waitForLoadState("load");
    await frame.setInputFiles(
      "#formRenderer\\:file_C02201_C022SO\\:file",
      filePath
    );
    await delay(8000);

    await fillByLabelInFrame(
      frame,
      "Persona de contacto de la Persona física (autónomo)",
      customer.Nombre,
      2000
    );

    await fillByLabelInFrame(
      frame,
      "Teléfono móvil de la Persona física (autónomo)",
      customer.Tlf,
      2000
    );

    await fillByLabelInFrame(
      frame,
      "Email contacto de la Persona física (autónomo)",
      customer.Email,
      2000
    );

    const provincia = await getCustomerProvinciaForRequestBono(customer);
    await selectMenuGotByLabelInFrame(
      frame,
      "Provincia de su domicilio fiscal",
      provincia,
      2000
    );

    const tieneEmpresas = await tieneEmpresasFunction(customer);
    await frame.getByLabel(tieneEmpresas, { exact: true }).click();
    await delay(2000);

    await fillByLabelInFrame(frame, "Persona de contacto", "Jorge Ferrando");

    await fillByLabelInFrame(frame, "Teléfono móvil", "615830090");

    await fillByLabelInFrame(
      frame,
      "Email contacto",
      "kitdigital.kd@gmail.com"
    );

    await selectGotByRoleInFrame(frame, "link", "Siguiente");

    // await closeContext(browser);

    return { success: true, message: "Bono requested succesfully", customer };
  } catch (error) {
    console.error("Error during bono request:", error);
    return { success: false, message: "Bono request failed", customer };
  }
};

// requestBono();

// module.exports = requestBono;
