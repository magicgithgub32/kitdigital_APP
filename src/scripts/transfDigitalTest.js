const {
  clearCookiesWhenAgentStringUsed,
  initContextWithAgentString,
  closeContextWhenAgentStringUsed,
  delay,
  selectTestToPassInAceleraPyme,
  loginInAceleraPyme,
  selectGotByText,
  selectGotByRole,
  selectGotById,
  clickSiguienteInCyberSec,
  clickSiguienteInCommerc,
  stepStrategyInTransfDigital,
  stepDigitalOrgInTransfDigital,
  stepInfraAndTechIntransfDigital,
  stepCyberSecInTransfDigital,
  stepRelathWithClientsInTransfDigital,
  stepBusinessProcessesInTransfDigital,
  stepSupportProcessesInTransfDigital,
} = require("./robodec");

const autoTransfDigit_URL =
  "https://www.acelerapyme.gob.es/descubre-tu-area-privada?check_logged_in=1";

const transfDigitalTest = async (customer) => {
  try {
    // const customer = {
    //   NIF_NIE: "18911675X",
    //   Nombre: "Agustín Dana",
    // };

    const firstName = customer.Nombre.split(" ")[0].trim();
    const firstNameArr = firstName.split("");

    const { page, context, browser } = await initContextWithAgentString({
      url: autoTransfDigit_URL,
    });

    await clearCookiesWhenAgentStringUsed(context);

    await page.goto(autoTransfDigit_URL);

    await loginInAceleraPyme(page, autoTransfDigit_URL, customer);

    await selectTestToPassInAceleraPyme(page, {
      accessibleName: "Autoevaluación de transformación digital",
    });

    if (firstNameArr.length > 5) {
      await stepStrategyInTransfDigital(page, /vital/i);

      await stepStrategyInTransfDigital(page, /cabo/i);

      await stepStrategyInTransfDigital(page, /alineación/i);

      await stepStrategyInTransfDigital(page, /planteado/i);

      await stepStrategyInTransfDigital(page, /fundamental/i);

      await selectGotByText(page, /útiles/i);

      await selectGotByRole(page, "button", "Siguiente");

      await stepDigitalOrgInTransfDigital(page, /bueno/i);

      await stepDigitalOrgInTransfDigital(page, /procesamiento/i);

      await stepDigitalOrgInTransfDigital(page, /uso diario/i);

      await selectGotByText(page, /teletrabajar/i);

      await selectGotByRole(page, "button", "Siguiente");

      await page.getByText("Si", { exact: true }).click();

      await selectGotById(
        page,
        "#edit-button-text-infrastructure-and-technology",
        "Siguiente"
      );

      await stepInfraAndTechIntransfDigital(page, /ADSL/i);

      await stepInfraAndTechIntransfDigital(page, /personal/i);

      await stepInfraAndTechIntransfDigital(page, /portátiles/i);

      await stepInfraAndTechIntransfDigital(page, /microsoft teams/i);

      await stepInfraAndTechIntransfDigital(page, /gestión de negocio/i);

      await selectGotByText(page, /aportarían/i);

      await selectGotByRole(page, "button", "Siguiente");

      await stepCyberSecInTransfDigital(page, /importante/i);

      await page.getByText("No", { exact: true }).click();

      await clickSiguienteInCyberSec(page);

      await selectGotByText(page, /están/i);

      await selectGotByRole(page, "button", "Siguiente");

      await stepRelathWithClientsInTransfDigital(page, /dispongo/i);

      await stepRelathWithClientsInTransfDigital(page, /definición/i);

      await stepRelathWithClientsInTransfDigital(page, /diversos/i);

      await stepRelathWithClientsInTransfDigital(page, /correos/i);

      await stepRelathWithClientsInTransfDigital(page, /no se utiliza/i);

      await selectGotByText(page, /no realizamos/i);

      await selectGotByRole(page, "button", "Siguiente");

      await selectGotByText(page, /PDF/i);

      await clickSiguienteInCommerc(page);

      await selectGotById(
        page,
        "#edit-p34-radios",
        "No, actualmente solo ofrecemos los productos y / o servicios de forma presencial"
      );

      await clickSiguienteInCommerc(page);

      await selectGotById(
        page,
        "#edit-p35-radios",
        "No, actualmente solo ofrecemos los productos y / o servicios de forma presencial"
      );

      await selectGotByRole(page, "button", "Siguiente");

      await stepBusinessProcessesInTransfDigital(
        page,
        /tengo ninguna herramienta/i
      );

      await stepBusinessProcessesInTransfDigital(page, /explotación/i);

      await stepBusinessProcessesInTransfDigital(
        page,
        /herramientas en el corto plazo/i
      );

      await selectGotByText(page, /estamos comenzando/i);

      await selectGotByRole(page, "button", "Siguiente");

      await stepSupportProcessesInTransfDigital(
        page,
        /necesario/i,
        "Siguiente"
      );

      await stepSupportProcessesInTransfDigital(
        page,
        /totalmente/i,
        "Siguiente"
      );

      await selectGotByText(page, /es posible me/i);

      await selectGotByRole(page, "button", "Finalizar");
    } else {
      await stepStrategyInTransfDigital(page, /vital/i);

      await stepStrategyInTransfDigital(page, /cabo/i);

      await stepStrategyInTransfDigital(page, /alineación/i);

      await stepStrategyInTransfDigital(page, /planteado/i);

      await stepStrategyInTransfDigital(page, /relevante/i);

      await selectGotByText(page, /conocerlas/i);

      await selectGotByRole(page, "button", "Siguiente");

      await stepDigitalOrgInTransfDigital(page, /bueno/i);

      await stepDigitalOrgInTransfDigital(page, /comunicación y colaboración/i);

      await stepDigitalOrgInTransfDigital(page, /pueden/i);

      await selectGotByText(page, /casos/i);

      await selectGotByRole(page, "button", "Siguiente");

      await page.getByText("Si", { exact: true }).click();

      await selectGotById(
        page,
        "#edit-button-text-infrastructure-and-technology",
        "Siguiente"
      );

      await stepInfraAndTechIntransfDigital(page, /Fibra/i);

      await stepInfraAndTechIntransfDigital(page, /día/i);

      await stepInfraAndTechIntransfDigital(
        page,
        /Tablets, smartphones u otros dispositivos/i
      );

      await stepInfraAndTechIntransfDigital(page, /Usb/i);

      await stepInfraAndTechIntransfDigital(page, /gestión económica/i);

      await selectGotByText(page, /analizando/i);

      await selectGotByRole(page, "button", "Siguiente");

      await stepCyberSecInTransfDigital(page, /seguridad infor/i);

      await page.getByText("No", { exact: true }).click();

      await clickSiguienteInCyberSec(page);

      await selectGotByText(page, /este tipo de/i);

      await selectGotByRole(page, "button", "Siguiente");

      await stepRelathWithClientsInTransfDigital(page, /no dispongo/i);

      await stepRelathWithClientsInTransfDigital(page, /negocio en/i);

      await stepRelathWithClientsInTransfDigital(page, /comenzar/i);

      await stepRelathWithClientsInTransfDigital(page, /diversos canales/i);

      await stepRelathWithClientsInTransfDigital(page, /envío/i);

      await stepRelathWithClientsInTransfDigital(page, /no se utiliza/i);

      await selectGotByText(page, /no realizamos/i);

      await selectGotByRole(page, "button", "Siguiente");

      await selectGotByText(page, /pdf/i);

      await clickSiguienteInCommerc(page);

      await page
        .locator("#edit-p34-radios")
        .getByText(
          "No, actualmente solo ofrecemos los productos y / o servicios de forma presencial"
        )
        .click();

      await clickSiguienteInCommerc(page);

      await page
        .locator("#edit-p35-radios")
        .getByText(
          "No, actualmente solo ofrecemos los productos y / o servicios de forma presencial"
        )
        .click();

      await selectGotByRole(page, "button", "Siguiente");

      await page
        .getByText(
          "No, pero estamos trabajando para incorporar una herramienta que nos ayude en la "
        )
        .click();

      await selectGotById(
        page,
        "#edit-button-text-business-processes",
        "Siguiente"
      );

      await stepBusinessProcessesInTransfDigital(page, /comenzar/i);

      await page
        .getByText(
          "No, pero estamos trabajando en poder implantar nuevas herramientas en el corto p"
        )
        .click();

      await selectGotById(
        page,
        "#edit-button-text-business-processes",
        "Siguiente"
      );

      await selectGotByText(page, /software de ERP/i);

      await selectGotByRole(page, "button", "Siguiente");

      await stepSupportProcessesInTransfDigital(
        page,
        /externalizados/i,
        "Siguiente"
      );

      await stepSupportProcessesInTransfDigital(
        page,
        /ningún tipo/i,
        "Siguiente"
      );

      await selectGotByText(page, /externalizadas/i);

      await delay(2000);

      await page.getByRole("button", { name: "Finalizar" }).click();
    }
    await closeContextWhenAgentStringUsed(context, browser);
    console.log("Second Autodiagnosis test successful");

    return {
      success: true,
      message: "Second Autodiagnosis test successful",
      customer,
    };
  } catch (error) {
    console.error("Error during autotransfer digital test process:", error);
    return { success: false, message: "AutoTransfer Digital test failed" };
  }
};

// transfDigitalTest();
module.exports = transfDigitalTest;
