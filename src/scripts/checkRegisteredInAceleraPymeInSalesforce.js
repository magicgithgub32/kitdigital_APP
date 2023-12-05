const {
  closeContextWhenAgentStringUsed,
  openSalesforceAndGoToCustomerAccount,
  clickAtLabel,
  saveChangesAtSalesforce,
  selectGotByText,
} = require("./robodec");

const checkRegisteredInAceleraPymeInSalesforce = async (customer) => {
  try {
    const { page, context, browser } =
      await openSalesforceAndGoToCustomerAccount(customer);

    await clickAtLabel(page, "KD - Substage tramitación robot, --None--");
    await page.waitForLoadState("domcontentloaded");

    await selectGotByText(page, "Registrado AceleraPyme", { exact: true });
    await page.waitForLoadState("domcontentloaded");

    // await selectGotByRole(page, "button", "Save");
    // await page.waitForLoadState("domcontentloaded");

    // await selectGotByRole(page, "button", "Edit Fecha registro AceleraPyme");
    // await page.waitForLoadState("domcontentloaded");

    // await clickAtLabel(page, "Fecha registro AceleraPyme");
    // await page.waitForLoadState("domcontentloaded");

    await saveChangesAtSalesforce(page);

    await closeContextWhenAgentStringUsed(context, browser);

    return {
      success: true,
      message:
        "Processed cliente registrado en AceleraPyme checked at Salesforce",
      customer,
    };
  } catch (error) {
    console.error(
      "Error during cliente registrado check at Salesforce process:",
      error
    );
    return {
      success: false,
      message: "Salesforce cliente registrado check process failed",
      customer,
    };
  }
};

// checkRegisteredInAceleraPymeInSalesforce();

module.exports = checkRegisteredInAceleraPymeInSalesforce;
