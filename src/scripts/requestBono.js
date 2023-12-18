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


const requestBono_URL =
  "https://sede.red.gob.es/convocatorias-y-ayudas?field_fecha_fin_plazo_value=1";

const requestBono = async () => {
  let customer = {
    Nombre: "Amparo Ruiz",
    Tlf: 666666666,
    Email: "amparor@gmail.es",
    Num_trabajadores: "Menos de 3 trabajadores",
    NIF_NIE: "20473233X",
    Localidad: "Azaila//Teruel//Aragón",
  };

    try {
      const { page, browser } = await initContext({
        url: requestBono_URL,
      });
    
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

    const solicitante = tipoDeSolicitante(customer)

    await tipoDeSolicitanteToSelect(frame,'[id="formRenderer:soli_empresa_autoempleo"]',solicitante);

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

    await frame.getByLabel("Persona de contacto de la Persona física (autónomo", customer.Nombre);
    await delay(2000);

    await frame.getByLabel("Teléfono móvil de la Persona física (autónomo", customer.Tlf);
    await delay(2000);

    await frame.getByLabel("Email contacto de la Persona física (autónomo", customer.Email);
    await delay(2000);

    const provincia = await getCustomerProvinciaForRequestBono(customer);

    await frame.getByLabel("Provincia de su domicilio fiscal", {exact: true}).selectOption(provincia);
    await delay(2000);

    const tieneEmpresas = tieneEmpresasFunction(customer);
    await frame.getByLabel(tieneEmpresas, {exact: true});
    await delay(2000);

    await frame.getByLabel("Persona de contacto", "Jorge Ferrando");
    await delay(2000);

    await frame.getByLabel("Teléfono móvil", 615830090);
    await delay(2000);

    await frame.getByLabel("Email contacto", "kitdigital.kd@gmail.com");
    await delay(2000);

    await frame.getByRole("link", {name: "Siguiente"}).click();

    //await closeContext(browser);

    return { success: true, message: "Bono requested succesfully", customer };
  } catch (error) {
    console.error("Error during bono request:", error);
    return { success: false, message: "Bono request failed", customer };
  }
};

requestBono();


//module.exports = requestBono

