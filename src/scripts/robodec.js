const { chromium } = require("playwright");
const { del } = require("request");

require("dotenv").config();

const initContext = async ({ url } = {}) => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  if (url) {
    await page.goto(url);
  }

  return { browser, page };
};

const initContextWithAgentString = async ({ url }) => {
  const userAgentString =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext({
    userAgent: userAgentString,
  });
  const page = await context.newPage();

  await page.goto(url);

  return { context, page, browser };
};

const initContextWithDialogHandler = async ({ url }) => {
  const { chromium } = require("playwright");

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-default-browser-check",
      "--no-first-run",
      "--disable-extensions",
      "--ignore-certificate-errors",
      "--autoplay-policy=no-user-gesture-required",
    ],
  });
  const page = await browser.newPage();

  await page.goto(url);
  await delay(2000);

  return { browser, page };
};

const closeContext = async (browser) => {
  await browser.close();
};

const closeContextWhenAgentStringUsed = async (context, browser) => {
  await context.close();
  await browser.close();
};

const handleIframe = async (page, select) => {
  await page.waitForSelector(select);
  const frameHandle = await page.$(select);
  const frame = await frameHandle.contentFrame();
  return frame;
};

const clearCookiesWhenAgentStringUsed = async (context) => {
  await context.clearCookies();
  await context.storageState({ clearCookies: true });
};

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const loginInAceleraPyme = async (page, URL, customer) => {
  let email = createEmailFromCustomerNIF(customer);

  await page.goto(URL);

  await page.waitForSelector('a[href="/user/login"]');
  await page.click('a[href="/user/login"]');

  await page.getByPlaceholder(/correo/i).fill(email);

  // await page.getByPlaceholder(/correo/i).fill("kd.declarando@visma.com");
  await delay(2000);

  await page.waitForSelector("input#edit-pass");
  await page.fill("input#edit-pass", `c0N7rA${customer.NIF_NIE}##<@>?!`);
  // await page.fill("input#edit-pass", "Gabsed-viszuv-pejra1");

  await page.getByText("Iniciar sesión").click();
  await delay(2000);
};

const selectTestToPassInAceleraPyme = async (page, { accessibleName }) => {
  await page.getByRole("link", { name: accessibleName, exact: true }).click();
  await delay(2000);
};

const fillByPlaceholder = async (page, placeholder, value, delayTime) => {
  await page.getByPlaceholder(placeholder).fill(value);
  delayTime && (await delay(delayTime));
};

const fillByLabel = async (page, label, value, delayTime) => {
  await page.getByLabel(label).fill(value);
  delayTime && (await delay(delayTime));
};

const fillByLabelInFrame = async (frame, label, value, delayTime) => {
  await frame.getByLabel(label, { exact: true }).fill(value);
  delayTime && (await delay(delayTime));
};

const selectGotByText = async (page, select, options = {}) => {
  await page.getByText(select, options).click();
  await delay(2000);
};

const selectGotByRole = async (page, role, nameSelected) => {
  await page.getByRole(role, { name: nameSelected }).click();
  await delay(2000);
};

const selectGotByRoleInFrame = async (frame, role, nameSelected) => {
  await frame.getByRole(role, { name: nameSelected }).click();
  await delay(2000);
};

const selectGotById = async (page, id, select) => {
  await page.locator(id).getByText(select).click();
};

const clickAtLabel = async (page, label, delayTime) => {
  await page.getByLabel(label, { exact: true }).click();
  delayTime && delay(delayTime);
};

const clickByPlaceholder = async (page, placeholder) => {
  await page.getByPlaceholder(placeholder).click();
  await delay(2000);
};

const pressKeyByPlaceholder = async (page, placeholder, key) => {
  await page.getByPlaceholder(placeholder).press(key);
  await delay(2000);
};

const getCustomerLocalidad = async (customer) => {
  const localidadValue = customer.Localidad;
  const localidadParts = localidadValue.split("//");
  const localidad = localidadParts[0].trim();
  const provincia = localidadParts[1].trim();
  const comunidadAut = localidadParts[2].trim();
  return { localidad, provincia, comunidadAut };
};

const selectMenuGotByLabel = async (page, label, select, delayTime) => {
  await page.getByLabel(label, { exact: true }).selectOption(select);
  delayTime && delay(delayTime);
};

const selectMenuGotByLabelNotExact = async (page, label, select, delayTime) => {
  await page.getByLabel(label, { exact: false }).selectOption(select);
  delayTime && delay(delayTime);
};

const selectMenuGotByLabelInFrame = async (frame, label, select, delayTime) => {
  await frame.getByLabel(label, { exact: true }).selectOption(select);
  delayTime && delay(delayTime);
};

const selectGotByLocator = async (
  page,
  locator,
  select,
  timeOutTime,
  delayTime
) => {
  const filterOptions = {
    hasText: select,
  };

  timeOutTime && (filterOptions.timeout = timeOutTime);

  await page.locator(locator).filter(filterOptions).click();

  delayTime && delay(delayTime);
};

const selectGotByOptionInFrame = async (frame, locator, option) => {
  await frame.selectOption(locator, option);
  await delay(2000);
};

const numRandomValue = (possibleValues) => {
  const randomValue =
    possibleValues[Math.floor(Math.random() * possibleValues.length)];
  return randomValue.toString();
};

const clickSiguienteBySelector = async (page, siguienteSelector) => {
  await page.click(siguienteSelector);
  delay(2000);
};

const selectCheckedByRadioAndSiguiente = async (
  selector,
  page,
  siguienteSelector
) => {
  await page.evaluate((selector) => {
    const radio = document.querySelector(selector);
    radio && (radio.checked = true);
  }, selector);

  await delay(2000);
  await clickSiguienteBySelector(page, siguienteSelector);
};

const cleanEmail = (customer) => {
  let cleanedEmail = customer.Email.replace(/^[^a-zA-Z0-9._-]+/, "");

  return cleanedEmail;
};

const cleanTlf = (customer) => {
  let cleanedTlf = customer.Tlf.toString().replace(/(\d)\s+(\d)/g, "$1$2");
  return cleanedTlf;
};

const fillUpTo9DigitsTlf = (customer) => {
  let cleanedTlf = cleanTlf(customer);

  let upTo9DigitsTlf = cleanedTlf;

  let wasShorter = false;

  let upTo9DigitsTlfArr = upTo9DigitsTlf.split("");

  if (upTo9DigitsTlfArr.length < 9) {
    wasShorter = true;
    for (let i = upTo9DigitsTlfArr.length - 1; i < 8; i++) {
      upTo9DigitsTlfArr.push("0");
    }
    upTo9DigitsTlf = upTo9DigitsTlfArr.join("");
  }
  return { telephone: upTo9DigitsTlf, wasShorter };
};

const openSalesforceAndGoToCustomerAccount = async (customer) => {
  let cleanedEmail = cleanEmail(customer);

  const salesforce_URL = "https://login.salesforce.com/?locale=es";

  const { page, context, browser } = await initContextWithAgentString({
    url: salesforce_URL,
  });

  await clearCookiesWhenAgentStringUsed(context);

  await clickAtLabel(page, "Nombre de usuario", 2000);

  await fillByLabel(page, "Nombre de usuario", "juanjo-uwfb@force.com", 2000);

  await clickAtLabel(page, "Contraseña", 2000);

  await fillByLabel(page, "Contraseña", process.env.SALESFORCE_PASSWORD, 2000);

  await selectGotByRole(page, "button", "Iniciar sesión");

  await delay(2000);

  await clickAtLabel(page, "Search", 2000);

  await fillByPlaceholder(page, "Search...", cleanedEmail, 1000);

  await pressKeyByPlaceholder(page, "Search...", "Enter");

  await page
    .getByRole("link", { name: `Kit Digital - ${cleanedEmail}` })
    .click();
  await delay(2000);

  await selectGotByRole(page, "button", "Edit KD - Substage tramitación robot");
  await delay(2000);
  await page.waitForLoadState("domcontentloaded");

  return { page, context, browser };
};

const saveChangesAtSalesforce = async (page) => {
  // await selectGotByRole(page, "button", "Today");
  // await delay(2000);

  await selectGotByRole(page, "button", "Save");
  await delay(2000);
};

///REGISTER IN ACELERAPYME FUNCTIONS///

const createEmailFromCustomerNIF = (customer) => {
  let customerNIF = customer.NIF_NIE;
  let cleanNIF = customerNIF.replace(/\D/g, "");
  let email = `kitdigital.kd+${cleanNIF}@gmail.com`;
  return email;
};

const createCodigoPostalDef = (customer) => {
  let codigoPostal = customer.CP.toString();
  let codigoPostalDef =
    codigoPostal.length < 5 ? `0${codigoPostal}` : codigoPostal;
  return codigoPostalDef;
};

const selectSoyAutonomo = async (customer, page) => {
  const selectLocatorAutonomo =
    'select.form-select.form-control[id^="edit-autonomus"]';

  const autonomo = customer.Autónomo;
  if (autonomo === "No") {
    await page.selectOption(selectLocatorAutonomo, "no");
  } else {
    await page.selectOption(selectLocatorAutonomo, "si");
  }
};

const capitalizeName = async (customer) => {
  let nameArr = customer.Nombre.split(" ");
  let capitalizedName = nameArr
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  return capitalizedName;
};

const señorOSeñora = (customer) => {
  return customer.Tratamiento === "Señor" || customer.Tratamiento === "Señora"
    ? customer.Tratamiento
    : "No deseo contestar";
};

///TRANSFORMACIÓN DIGITAL TEST FUNCTIONS///

const stepCyberSecInTransfDigital = async (page, select) => {
  await selectGotByText(page, select);
  await page
    .locator("#edit-button-text-cybersecurity")
    .getByText("Siguiente")
    .click();
  await delay(2000);
};

const clickSiguienteDigOrgan = async (page) => {
  await delay(2000);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector("#edit-button-text-digital-organization", {
    state: "visible",
  });
  await page.click("#edit-button-text-digital-organization");
};

const clickSiguienteSinceInfraAndTech = async (page) => {
  await page
    .locator("#edit-button-text-infrastructure-and-technology")
    .getByText("Siguiente")
    .click();
  await delay(2000);
};

const clickSiguienteInCyberSec = async (page) => {
  await page
    .locator("#edit-button-text-cybersecurity")
    .getByText("Siguiente")
    .click();
  await delay(2000);
};

const clickSiguienteInCustRel = async (page) => {
  await delay(2000);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector(
    "div.btn.btn-primary.button_next_question_test.button-next.button-relationship-with-clients",
    { state: "visible" }
  );
  await page.click(
    "div.btn.btn-primary.button_next_question_test.button-next.button-relationship-with-clients"
  );
};

const clickSiguienteInCommerc = async (page) => {
  await page
    .locator("#edit-button-text-commercialization")
    .getByText("Siguiente")
    .click();
  await delay(2000);
};

const clickSiguienteInBusinessProcesses = async (page) => {
  await delay(2000);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector(
    "div.btn.btn-primary.button_next_question_test.button-next.button-business-processes",
    { state: "visible" }
  );
  await page.click(
    "div.btn.btn-primary.button_next_question_test.button-next.button-business-processes"
  );
};

const clickSiguienteInSupportProcesses = async (page) => {
  await delay(2000);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector(
    "div.btn.btn-primary.button_next_question_test.button-next.button-support-processes",
    { state: "visible" }
  );
  await page.click(
    "div.btn.btn-primary.button_next_question_test.button-next.button-support-processes"
  );
};

const stepStrategyInTransfDigital = async (page, select) => {
  await selectGotByText(page, select);
  await page
    .locator("#edit-button-text-strategy")
    .getByText("Siguiente")
    .click();
  await delay(2000);
};

const stepDigitalOrgInTransfDigital = async (page, select) => {
  await selectGotByText(page, select);
  await page
    .locator("#edit-button-text-digital-organization")
    .getByText("Siguiente")
    .click();
  await delay(2000);
};

const stepInfraAndTechIntransfDigital = async (page, select) => {
  await selectGotByText(page, select);
  await page
    .locator("#edit-button-text-infrastructure-and-technology")
    .getByText("Siguiente")
    .click();
  await delay(2000);
};

const stepRelathWithClientsInTransfDigital = async (page, select) => {
  await selectGotByText(page, select);
  await page
    .locator("#edit-button-text-relationship-with-clients")
    .getByText("Siguiente")
    .click();
  await delay(2000);
};

const stepCommercInTransfDigital = async (page, select) => {
  await selectGotByText(page, select);
  await page
    .locator("#edit-button-text-commercialization")
    .getByText("Siguiente")
    .click();
  await delay(2000);
};

const stepBusinessProcessesInTransfDigital = async (page, select) => {
  await selectGotByText(page, select);
  await page
    .locator("#edit-button-text-business-processes")
    .getByText("Siguiente")
    .click();
  await delay(2000);
};

const stepSupportProcessesInTransfDigital = async (page, select, selectTwo) => {
  await selectGotByText(page, select);
  await selectGotByText(page, selectTwo);
};

///CIBERSEGURIDAD TEST FUNCTIONS///

const clickSiguienteInDeviceSecuritySectionAndDelay = async (
  page,
  delayTime
) => {
  await page
    .locator("#edit-button-text-device-security")
    .getByText("Siguiente")
    .click();
  delayTime && (await delay(delayTime));
};

const clickSiguienteInAccessManagementSectionAndDelay = async (
  page,
  delayTime
) => {
  await page
    .locator("#edit-button-text-access-management")
    .getByText("Siguiente")
    .click();
  delayTime && (await delay(delayTime));
};

const clickSiguienteInEquipmentSystemsSectionAndDelay = async (
  page,
  delayTime
) => {
  await page
    .locator("#edit-button-text-equipment-systems")
    .getByText("Siguiente")
    .click();
  delayTime && (await delay(delayTime));
};

///REQUESTBONO FUNCTIONS ///

const tipoDeSegmento = (customer) => {
  let segmentoI = "C022/22-SI";
  let segmentoII = "C015/22-SI";
  let segmentoIII = "C005/22-SI";
  return customer.Num_trabajadores === "Menos de 3 trabajadores"
    ? segmentoI
    : customer.Num_trabajadores === "Entre 3 y 9 trabajadores"
    ? segmentoII
    : customer.Num_trabajadores === "Entre 10 y 49 trabajadores"
    ? segmentoIII
    : "";
};

const codigoSegmentoToClick = async (page, segmento, delay) => {
  await page.getByRole("link", { name: segmento }).click();
  await delay(2000);
};

const tipoDeSolicitante = (customer) => {
  let autonomo = "autoempleo";
  let empresa = "empresa";
  return customer.Num_trabajadores === "Menos de 3 trabajadores"
    ? autonomo
    : empresa;
};

const tipoDeSolicitanteToSelect = async (frame, locator, solicitante) => {
  await frame.selectOption(locator, solicitante);
  await delay(2000);
};

const getCustomerProvinciaForRequestBono = async (customer) => {
  const localidadResult = await getCustomerLocalidad(customer);
  const provinciaInUpperCase = localidadResult.provincia.toUpperCase();
  return provinciaInUpperCase;
};

const tieneEmpresasFunction = async (customer) => {
  let siTiene = "Si";
  let noTiene = "No";
  return customer.Num_trabajadores === "Menos de 3 trabajadores"
    ? noTiene
    : siTiene;
};

module.exports = {
  initContext,
  initContextWithAgentString,
  initContextWithDialogHandler,
  closeContext,
  closeContextWhenAgentStringUsed,
  handleIframe,
  clearCookiesWhenAgentStringUsed,
  delay,
  fillByPlaceholder,
  fillByLabel,
  fillByLabelInFrame,
  loginInAceleraPyme,
  selectTestToPassInAceleraPyme,
  selectGotByText,
  selectGotByRole,
  selectGotByRoleInFrame,
  selectGotById,
  clickAtLabel,
  clickByPlaceholder,
  pressKeyByPlaceholder,
  getCustomerLocalidad,
  selectMenuGotByLabel,
  selectMenuGotByLabelNotExact,
  selectMenuGotByLabelInFrame,
  selectGotByLocator,
  selectGotByOptionInFrame,
  numRandomValue,
  clickSiguienteBySelector,
  selectCheckedByRadioAndSiguiente,
  cleanTlf,
  fillUpTo9DigitsTlf,
  openSalesforceAndGoToCustomerAccount,
  saveChangesAtSalesforce,
  createEmailFromCustomerNIF,
  createCodigoPostalDef,
  selectSoyAutonomo,
  capitalizeName,
  señorOSeñora,
  clickSiguienteDigOrgan,
  clickSiguienteSinceInfraAndTech,
  clickSiguienteInCyberSec,
  clickSiguienteInCustRel,
  clickSiguienteInCommerc,
  clickSiguienteInBusinessProcesses,
  clickSiguienteInSupportProcesses,
  stepStrategyInTransfDigital,
  stepDigitalOrgInTransfDigital,
  stepInfraAndTechIntransfDigital,
  stepCyberSecInTransfDigital,
  stepRelathWithClientsInTransfDigital,
  stepCommercInTransfDigital,
  stepSupportProcessesInTransfDigital,
  stepBusinessProcessesInTransfDigital,
  clickSiguienteInDeviceSecuritySectionAndDelay,
  clickSiguienteInAccessManagementSectionAndDelay,
  clickSiguienteInEquipmentSystemsSectionAndDelay,
  tipoDeSegmento,
  codigoSegmentoToClick,
  tipoDeSolicitante,
  tipoDeSolicitanteToSelect,
  getCustomerProvinciaForRequestBono,
  tieneEmpresasFunction,
};
