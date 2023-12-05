const {
  closeContextWhenAgentStringUsed,
  openSalesforceAndGoToCustomerAccount,
  clickAtLabel,
  saveChangesAtSalesforce,
  selectGotByText,
} = require("./robodec");

const checkAceleraPymeAccountActivatedInSalesforce = async (customer) => {
  try {
    const { page, context, browser } =
      await openSalesforceAndGoToCustomerAccount(customer);

    await clickAtLabel(
      page,
      "KD - Substage tramitación robot, Registrado AceleraPyme"
    );
    await page.waitForLoadState("domcontentloaded");

    await selectGotByText(page, "Cuenta AceleraPyme activada", { exact: true });
    await page.waitForLoadState("domcontentloaded");

    // await selectGotByRole(page, "button", "Save");
    // await page.waitForLoadState("domcontentloaded");

    // await selectGotByRole(
    //   page,
    //   "button",
    //   "Edit Fecha cuenta AceleraPyme activada"
    // );
    // await page.waitForLoadState("domcontentloaded");

    // await clickAtLabel(page, "Fecha cuenta AceleraPyme activada");
    // await page.waitForLoadState("domcontentloaded");

    await saveChangesAtSalesforce(page);

    await closeContextWhenAgentStringUsed(context, browser);

    return {
      success: true,
      message: "Processed cuenta activada successfully checked at Salesforce",
      customer,
    };
  } catch (error) {
    console.error(
      "Error during cuenta activada check at Salesforce process:",
      error
    );
    return {
      success: false,
      message: "Salesforce cuenta activada's customer check process failed",
      customer,
    };
  }
};

// checkAceleraPymeAccountActivatedInSalesforce();

module.exports = checkAceleraPymeAccountActivatedInSalesforce;
