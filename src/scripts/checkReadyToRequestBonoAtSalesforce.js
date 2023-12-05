const {
  closeContextWhenAgentStringUsed,
  openSalesforceAndGoToCustomerAccount,
  clickAtLabel,
  saveChangesAtSalesforce,
  selectGotByText,
} = require("./robodec");

const checkReadyToRequestBonoAtSalesforce = async (customer) => {
  try {
    const { page, context, browser } =
      await openSalesforceAndGoToCustomerAccount(customer);

    await clickAtLabel(
      page,
      "KD - Substage tramitación robot, Cuenta AceleraPyme activada"
    );
    await page.waitForLoadState("domcontentloaded");

    await selectGotByText(page, "Test de autodiagnóstico hecho", {
      exact: true,
    });
    await page.waitForLoadState("domcontentloaded");

    // await selectGotByRole(page, "button", "Save");
    // await page.waitForLoadState("domcontentloaded");

    // await selectGotByRole(
    //   page,
    //   "button",
    //   "Edit Fecha test de autodiagnóstico hecho"
    // );
    // await page.waitForLoadState("domcontentloaded");

    // await clickAtLabel(page, "Fecha test de autodiagnóstico hecho");
    // await page.waitForLoadState("domcontentloaded");

    await saveChangesAtSalesforce(page);

    await closeContextWhenAgentStringUsed(context, browser);

    return {
      success: true,
      message:
        "Processed customer's autodiagnosis test  successfully checked at Salesforce",
      customer,
    };
  } catch (error) {
    console.error("Error during salesforceCustomerCheck process:", error);
    return {
      success: false,
      message: "Salesforce's customer check process failed",
      customer,
    };
  }
};

// checkReadyToRequestBonoAtSalesforce();

module.exports = checkReadyToRequestBonoAtSalesforce;
