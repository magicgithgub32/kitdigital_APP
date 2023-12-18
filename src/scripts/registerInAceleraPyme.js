const {
  delay,
  initContext,
  closeContext,
  fillByPlaceholder,
  selectGotByText,
  selectGotByLocator,
  selectMenuGotByLabel,
  clickAtLabel,
  createEmailFromCustomerNIF,
  createCodigoPostalDef,
  getCustomerLocalidad,
  selectSoyAutonomo,
  capitalizeName,
  señorOSeñora,
  cleanTlf,
  fillUpTo9DigitsTlf,
} = require("./robodec");

const aceleraPyme_URL = "https://www.acelerapyme.gob.es/registro-pyme";

const registerInAceleraPyme = async (customer) => {
  try {
    let email = createEmailFromCustomerNIF(customer);

    let { telephone, wasShorter } = fillUpTo9DigitsTlf(customer);

    const { page, browser } = await initContext({ url: aceleraPyme_URL });

    await delay(2000);

    const definitiveTratamiento = await señorOSeñora(customer);

    // await clickAtLabel(page, definitiveTratamiento, 2000); //de repente dejó de funcionar (cambio en la web?)
    await selectGotByText(page, definitiveTratamiento);

    const capitalizedName = await capitalizeName(customer);

    await fillByPlaceholder(page, /apellidos/i, capitalizedName, 2000);

    await fillByPlaceholder(page, /@contacto.com/i, email, 2000);

    // await fillByPlaceholder(page, /teléfono/i, cleanedTlf, 2000);
    // await fillByPlaceholder(page, /teléfono/i, upTo9DigitsTlf, 2000);
    await fillByPlaceholder(page, /teléfono/i, telephone, 2000);

    // const cargoOptions = ["others", "management_position", "technicians"];
    // const randomCargoOption =
    //   cargoOptions[Math.floor(Math.random() * cargoOptions.length)];

    // const menuItem = await page.locator("#edit-position", {
    //   name: randomCargoOption,
    // });
    // await menuItem.click();

    await selectGotByText(page, "Continuar");

    await page.waitForLoadState("domcontentloaded");
    await delay(2000);

    if (customer.Nombre === customer.Razón_Social) {
      await fillByPlaceholder(page, /empresa/, capitalizedName, 2000);
    } else {
      await fillByPlaceholder(page, /empresa/, customer.Razón_Social, 2000);
    }

    let dni = customer.NIF_NIE.trim();
    await fillByPlaceholder(page, /nif/i, dni, 2000);

    const { comunidadAut, provincia, localidad } = await getCustomerLocalidad(
      customer
    );

    await selectMenuGotByLabel(page, "Comunidad Autónoma", comunidadAut);

    await selectMenuGotByLabel(page, "Provincia", provincia, 2000);

    await selectMenuGotByLabel(page, "Localidad", localidad, 2000);

    let codigoPostalDef = await createCodigoPostalDef(customer);

    await fillByPlaceholder(page, /postal/i, codigoPostalDef, 2000);

    await selectGotByLocator(page, "a", "Seleccionar");

    await selectGotByLocator(page, "li", customer.CNAE, 50000, 2000);

    await selectSoyAutonomo(customer, page);

    await delay(2000);

    // customer.Num_trabajadores
    //   ? await clickAtLabel(page, customer.Num_trabajadores, 2000)
    //   : await clickAtLabel(page, "Menos de 3 trabajadores", 2000); //de repente dejó de funcionar (cambio en la web?)
    await selectGotByText(page, customer.Num_trabajadores);

    await selectGotByText(page, "Consentimiento expreso");

    await selectGotByText(page, "Continuar");

    await delay(10000);

    await selectGotByText(page, "Finalizar registro");

    await closeContext(browser);

    return {
      success: true,
      message: "Registration successful",
      phoneInfo: wasShorter
        ? "Original phone number was shorter than 9 digits"
        : "Phone number was complete",
    };
  } catch (error) {
    console.error("Error during registration:", error);
    return { success: false, message: "Registration failed" };
  }
};

// registerInAceleraPyme();
module.exports = registerInAceleraPyme;
