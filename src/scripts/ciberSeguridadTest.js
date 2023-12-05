const {
  initContextWithAgentString,
  clearCookiesWhenAgentStringUsed,
  closeContextWhenAgentStringUsed,
  selectTestToPassInAceleraPyme,
  loginInAceleraPyme,
  selectGotByText,
  selectGotByRole,
  clickSiguienteInDeviceSecuritySectionAndDelay,
  clickSiguienteInEquipmentSystemsSectionAndDelay,
  clickSiguienteInAccessManagementSectionAndDelay,
} = require("./robodec");

const cyberSecurity_URL =
  "https://www.acelerapyme.gob.es/descubre-tu-area-privada?check_logged_in=1";

const ciberSeguridadTest = async (customer) => {
  try {
    // const customer = {
    //   NIF_NIE: "18911675X",
    //   Nombre: "Agus Dana",
    // };

    const firstName = customer.Nombre.split(" ")[0].trim();
    const firstNameArr = firstName.split("");

    const { page, context, browser } = await initContextWithAgentString({
      url: cyberSecurity_URL,
    });

    await clearCookiesWhenAgentStringUsed(context);

    await loginInAceleraPyme(page, cyberSecurity_URL, customer);

    await selectTestToPassInAceleraPyme(page, {
      accessibleName: "Autoevaluación de ciberseguridad",
    });

    if (firstNameArr.length > 5) {
      await selectGotByText(page, "No conozco");

      await selectGotByRole(page, "button", "Siguiente");

      await selectGotByText(page, "Todos los dispositivos cuentan");

      await clickSiguienteInDeviceSecuritySectionAndDelay(page, 2000);

      await selectGotByText(page, "No.");

      await selectGotByRole(page, "button", "Siguiente");

      await selectGotByText(page, "No, se dispone de");

      await selectGotByRole(page, "button", "Siguiente");

      await selectGotByText(page, "No se dispone");

      await clickSiguienteInAccessManagementSectionAndDelay(page, 2000);

      await selectGotByText(
        page,
        "Sí, todos los empleados cuentan con un usuario nominal y"
      );

      await clickSiguienteInAccessManagementSectionAndDelay(page, 2000);

      await selectGotByText(page, "Algunos empleados");

      await selectGotByRole(page, "button", "Siguiente");

      await selectGotByText(page, "No he tenido");

      await selectGotByRole(page, "button", "Siguiente");

      await selectGotByText(page, "Si, pero no");

      await clickSiguienteInEquipmentSystemsSectionAndDelay(page, 2000);

      await selectGotByText(page, "Sí, se utilizan");

      await clickSiguienteInEquipmentSystemsSectionAndDelay(page, 2000);

      await selectGotByText(page, "Sí, se realizan copias de seguridad de");

      await clickSiguienteInEquipmentSystemsSectionAndDelay(page, 2000);

      await selectGotByText(page, "Si, los equipos");

      await selectGotByRole(page, "button", "Siguiente");
    } else {
      await selectGotByText(page, "No conozco");

      await selectGotByRole(page, "button", "Siguiente");

      await selectGotByText(page, "Algunos dispositivos sí");

      await clickSiguienteInDeviceSecuritySectionAndDelay(page, 2000);

      await selectGotByText(page, "No.");

      await selectGotByRole(page, "button", "Siguiente");

      await selectGotByText(page, "Sí, no obstante");

      await selectGotByRole(page, "button", "Siguiente");

      await selectGotByText(page, "Sí se dispone, no obstante ");

      await clickSiguienteInAccessManagementSectionAndDelay(page, 2000);

      await selectGotByText(
        page,
        "Sí, todos los empleados cuentan con un usuario nominal, no"
      );

      await clickSiguienteInAccessManagementSectionAndDelay(page, 2000);

      await selectGotByText(page, "Desconozco");

      await selectGotByRole(page, "button", "Siguiente");

      await selectGotByText(page, "No he tenido");

      await selectGotByRole(page, "button", "Siguiente");

      await selectGotByText(page, "Si, incluye ");

      await clickSiguienteInEquipmentSystemsSectionAndDelay(page, 2000);

      await selectGotByText(page, "No, solo");

      await clickSiguienteInEquipmentSystemsSectionAndDelay(page, 2000);

      await selectGotByText(page, "Sí, se realizan copias de seguridad de");

      await clickSiguienteInEquipmentSystemsSectionAndDelay(page, 2000);

      await selectGotByText(page, "Si, los equipos y sistemas");

      await selectGotByRole(page, "button", "Siguiente");
    }
    console.log("Third Autodiagnosis test successfully executed");

    await closeContextWhenAgentStringUsed(context, browser);

    return { success: true, message: "Third Autodiagnosis test successful" };
  } catch (error) {
    console.error("Error during Cybersecurity test process:", error);
    return { success: false, message: "Cybersecurity test failed" };
  }
};

// ciberSeguridadTest();

module.exports = ciberSeguridadTest;
