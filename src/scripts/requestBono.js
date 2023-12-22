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
  getNumberOfPartners,
  getColaboradoresDNI,
  getColaboradoresInfo,
} = require("./robodec");

const { exec } = require("child_process");
const fs = require("fs");
const request = require("request");
const { chromium } = require("playwright");
const path = require("path");
const { log } = require("console");

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
    Nombre: "Ana Maria Pulido de los Reyes",
    Tlf: "627032097",
    Email: "ana@sankaraeventos.com",
    Num_trabajadores: "Menos de 3 trabajadores",
    NIF_NIE: "52100572Y",
    Localidad: "Torrejón de Velasco//Madrid//Madrid, Comunidad de",
    Autónomos_Colaboradores:
      "Ana Maria Pulido de los Reyes/SARA LOPEZ BARANDA/Ángel López",
    NIF_Colaboradores: "70055537K/53657594C",
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

    await delay(5000);

    // page.on("dialog", async (dialog) => {
    //   console.log("dialog", dialog.message());
    //   await dialog.accept();
    // });

    // await runAppleScript();

    let frame = await handleIframe(page, ".iframeTasks");

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
    console.log("customerFileName", customerFileName);

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
    await delay(15000);

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

    const tieneEmpresas = tieneEmpresasFunction(customer);
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

    frame = await handleIframe(page, ".iframeTasks");

    let partnerData = getNumberOfPartners(customer);
    let numberOfPartners = partnerData.numeroDeSocios;
    console.log("numero de socios", numberOfPartners);

    if (numberOfPartners === "0") {
      await selectGotByRoleInFrame(frame, "link", "Siguiente");
    } else {
      await selectGotByOptionInFrame(
        frame,
        '[id="formRenderer:autonomos_colaboradores_numero"]',
        numberOfPartners
      );

      await frame
        .getByLabel(
          "Declaro responsablemente que los autónomos colaboradores declarados en el presente formulario han ejercido su actividad en exclusiva para la persona física (autónomo) solicitante durante el periodo de referencia considerado para el cálculo de la plantilla media de trabajadores. Este periodo se indica en las bases de la convocatoria.",
          { exact: true }
        )
        .click();
      await delay(2000);

      let colaboradoresInfo = getColaboradoresInfo(customer);

      for (let colaboradorInfo of colaboradoresInfo) {
        console.log(
          "DNI:",
          colaboradorInfo.dni,
          "Name:",
          colaboradorInfo.name,
          "Surname:",
          colaboradorInfo.surname
        );

        await frame
          .locator('[id="formRenderer:AC_1_autonomo_nif"]')
          .fill(colaboradorInfo.dni.toString());

        //? HACER IGUAL LOS DE ABAJO QUE ÉSTE DE ARRIBA

        await fillByLabelInFrame(
          frame,
          "NOMBRE",
          colaboradorInfo.name.toString()
        );

        await fillByLabelInFrame(
          frame,
          "APELLIDOS",
          colaboradorInfo.surname.toString()
        );
      }
    }

    // await selectGotByRoleInFrame(frame, "link", "Siguiente");

    // await closeContext(browser);

    return { success: true, message: "Bono requested succesfully", customer };
  } catch (error) {
    console.error("Error during bono request:", error);
    return { success: false, message: "Bono request failed", customer };
  }
};

// requestBono();

// module.exports = requestBono;
