const {
  closeContext,
  initContext,
  delay,
  handleIframe,
  tipoDeSegmento,
  codigoSegmentoToClick,
  tipoDeSolicitante,
  tipoDeSolicitanteToSelect,
  getCustomerProvinciaForRequestBono,
  tieneEmpresasFunction,
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


const requestBono_URL =
  "https://sede.red.gob.es/convocatorias-y-ayudas?field_fecha_fin_plazo_value=1";

const requestBono = async () => {
  let customer = {
    Nombre: "Amparo Ruiz",
    Tlf: "666666666",
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

    await codigoSegmentoToClick(page, segmento)

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

//    await delay(25000);

    const frame = await handleIframe(page, ".iframeTasks");

    const solicitante = tipoDeSolicitante(customer)

    await tipoDeSolicitanteToSelect(frame,'[id="formRenderer:soli_empresa_autoempleo"]',solicitante);

    await selectGotByOptionInFrame(frame,'[id="formRenderer:representante_tipo"]', solicitante )

    await selectGotByOptionInFrame(frame,'[id="formRenderer:representante_tipo_voluntario"]',
    "Persona Física" )

    const basePath = path.join(
      //CHECK PATH
      "/OneDrive",
      "Escritorio",
      "kitdigital_APP",
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
    await delay(20000)

    await fillByLabelInFrame(frame,"Persona de contacto de la Persona física (autónomo)", customer.Nombre )

    await fillByLabelInFrame(frame,"Teléfono móvil de la Persona física (autónomo)", customer.Tlf)

    await fillByLabelInFrame(frame,"Email contacto de la Persona física (autónomo)", customer.Email)

    const provincia = await getCustomerProvinciaForRequestBono(customer);
    await selectMenuGotByLabelInFrame(frame, "Provincia de su domicilio fiscal", provincia, 2000)

    const tieneEmpresas = tieneEmpresasFunction(customer);
    await frame.getByLabel(tieneEmpresas, {exact: true});
    await delay(2000);

    await fillByLabelInFrame(frame, "Persona de contacto", "Jorge Ferrando");

    await fillByLabelInFrame(frame, "Teléfono móvil","615830090");

    await fillByLabelInFrame(frame, "Email de contacto", "kitdigital.kd@gmail.com");

    await selectGotByRoleInFrame(frame, "link","Siguiente");

    //await closeContext(browser);

    return { success: true, message: "Bono requested succesfully", customer };
  } catch (error) {
    console.error("Error during bono request:", error);
    return { success: false, message: "Bono request failed", customer };
  }
};

requestBono();


//module.exports = requestBono

