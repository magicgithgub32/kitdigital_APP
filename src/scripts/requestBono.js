const {
  closeContext,
  initContext,
  delay,
  handleIframe,
  codigoSegmentoToClick,
  tipoDeSegmento,
  selectGotByRole,
  selectGotByRoleInFrame,
  stepFirmaDeclaraciones,
  stepAutonomosColaboradores,
  stepVerificacionesIniciales,
  selectGotByLocatorInFrame,
  fillByLabelInFrame,
  selectMenuGotByLabelInFrameNotExact,
  selectIAE,
} = require("./robodec");

const { exec } = require("child_process");
const request = require("request");
const { chromium } = require("playwright");
const { log } = require("console");

const requestBono_URL =
  "https://sede.red.gob.es/convocatorias-y-ayudas?field_fecha_fin_plazo_value=1";

const requestBono = async () => {

  try {
    const { page, browser } = await initContext({
      url: requestBono_URL,
    });

    const segmento = tipoDeSegmento(customer);

    await codigoSegmentoToClick(page, segmento, delay);

    await selectGotByRole(page, "link", "Acceder al trámite");

    await page
      .getByRole("group", { name: "Acceso mediante certificado digital." })
      .getByRole("button")
      .click();

    await delay(20000);

    await stepVerificacionesIniciales(page, customer);

    await delay(2000);

    await stepAutonomosColaboradores(page, customer);

    await delay(2000);

    frame = await handleIframe(page, ".iframeTasks");

    await selectGotByRoleInFrame(frame, "link", "Siguiente");

    await delay(2000);

    // if (customer.Num_trabajadores === "Menos de 3 trabajadores") {
    //PARECE QUE ES LO MISMO PARA TODOS LOS SEGMENTOS, CON LO QUE AHORRAMOS ESTE IF-ELSE

    await stepFirmaDeclaraciones(page);

    await selectIAE(page, customer);

    frame = await handleIframe(page, ".iframeTasks");

    await fillByLabelInFrame(
      frame,
      "Importe en euros de las ayudas de minimis recibidas",
      "0",
      2000
    );

    await selectGotByRoleInFrame(frame, "link", "Siguiente");

    frame = await handleIframe(page, ".iframeTasks");

    await frame.locator('[id="formRenderer:check_obligaciones"]').click();

    await delay(2000);

    await selectGotByRoleInFrame(frame, "link", "Siguiente");

    await page.waitForSelector("text=Siguiente", { state: "visible" });
    await page.click("text=Siguiente");

    await page.waitForSelector("text=Firmar", { state: "visible" });
    await page.click("text=Firmar");

    await page.click('a.button[title="Firma con certificado local"]');

    await page.click("#buttonSign");

    await page.waitForSelector("text=Presentar", { state: "visible" });
    await page.click("text=Presentar");

    await page.waitForSelector("text=Finalizar", { state: "visible" });
    await page.click("text=Finalizar");

    await closeContext(browser);

    return { success: true, message: "Bono requested succesfully", customer };
  } catch (error) {
    console.error("Error during bono request:", error);
    return { success: false, message: "Bono request failed", customer };
  }
};

 requestBono();

// module.exports = requestBono;
