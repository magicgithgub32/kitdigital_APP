const {
  closeContext,
  initContext,
  delay,
  selectGotByText,
  initContextWithDialogHandler,
  handleIframe,
  codigoSegmentoToClick,
  tipoDeSegmento,
  tipoDeSolicitante,
  tipoDeSolicitanteToSelect,
  getCustomerLocalidad,
  getCustomerProvinciaForRequestBono,
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
    Tlf: 666333777,
    Email: "amparoruiz@gmail.com",
    Num_trabajadores: "Menos de 3 trabajadores",
    NIF_NIE: "20473233J",
    Localidad: "Azaila//TERUEL//Aragón",
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

    await page.getByRole("link", { name: "Acceder al trámite" }).click();
    await delay(2000);

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

    await frame.setInputFiles(
      "#formRenderer\\:file_C02201_C022SO\\:file",
      filePath
    );

    // await frame.waitForSelector("input#formRenderer:soli_persona_contacto");
    // await frame.fill(
    //   "input#formRenderer:soli_persona_contacto",
    //   customer.Nombre
    // );
    await frame.getByLabel(
      "Persona de contacto de la Persona física (autónomo)",
      customer.Nombre
    );
    await delay(2000);

    // await frame.waitForSelector("input#formRenderer:soli_telefono_movil");
    // await frame.fill("input#formRenderer:soli_telefono_movil", customer.Tlf);
    await frame.getByLabel(
      "Teléfono móvil de la Persona física (autónomo)",
      customer.Tlf
    );
    await delay(2000);

    // await frame.waitForSelector("input#formRenderer:soli_email");
    // await frame.fill("input#formRenderer:soli_email", customer.Email);
    await frame.getByLabel(
      "Email contacto de la Persona física (autónomo)",
      customer.Email
    );
    await delay(2000);

    // const { provincia } = await getCustomerLocalidad(customer);
    // await frame.waitForSelector("input#formRenderer:soli_provincia");
    // await frame.selectOption(provincia);

    const provincia = await getCustomerProvinciaForRequestBono(customer);

    await frame
      .getByLabel("Provincia de su domicilio fiscal", { exact: true })
      .selectOption(provincia);
    await delay(2000);

    const tieneEmpresasFunction = async (customer) => {
      let siTiene = "#formRenderer:soli_empresas_vinculadas:0";
      let noTiene = "formRenderer:soli_empresas_vinculadas:1";
      return customer.Num_trabajadores === "Menos de 3 trabajadores"
        ? noTiene
        : siTiene;
    };

    const tieneEmpresas = tieneEmpresasFunction(customer);
    // await frame.getByText(tieneEmpresas);
    await frame.getByLabel(tieneEmpresas, { exact: true });
    await delay(2000);

    // await frame.waitforSelector(
    //   "input#formRenderer:entidad_autorizada_persona_contacto"
    // );
    // await frame.fill(
    //   "input#formRenderer:entidad_autorizada_persona_contacto",
    //   "Jorge Ferrando"
    // );
    await frame.getByLabel("Persona de contacto", "Jorge Ferrando");
    await delay(2000);

    // await frame.waitforSelector(
    //   "input#formRenderer:entidad_autorizada_telefono_movil"
    // );
    await frame.getByLabel("Teléfono móvil", 615830090);
    await delay(2000);

    // await frame.fill(
    //   "input#formRenderer:entidad_autorizada_telefono_movil",
    //   666666666
    // );
    // await delay(2000);

    // await frame.waitforSelector("input#formRenderer:entidad_autorizada_email");
    // await frame.fill(
    //   "input#formRenderer:entidad_autorizada_email",
    //   "kitdigital.kd@gmail.com"
    // );
    await frame.getByLabel("Email contacto", "kitdigital.kd@gmail.com");
    await delay(2000);

    await frame.getByRole("link", { name: "Siguiente" }).click();

    // await closeContext(browser);

    return { success: true, message: "Bono requested succesfully", customer };
  } catch (error) {
    console.error("Error during bono request:", error);
    return { success: false, message: "Bono request failed", customer };
  }
};

requestBono();

// module.exports = requestBono;
