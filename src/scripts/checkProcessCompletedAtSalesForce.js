const {
  clickAtLabel,
  closeContextWhenAgentStringUsed,
  openSalesforceAndGoToCustomerAccount,
  saveChangesAtSalesforce,
  selectGotByText,
} = require("./robodec");

const checkProcessCompletedAtSalesForce = async (customer) => {
  try {
    const { page, context, browser } =
      await openSalesforceAndGoToCustomerAccount(customer);

    await clickAtLabel(
      page,
      "KD - Substage tramitación robot, Test de autodiagnóstico hecho"
    );
    await page.waitForLoadState("domcontentloaded");

    await selectGotByText(page, "Tramitación robot completada", {
      exact: true,
    });

    await page.waitForLoadState("domcontentloaded");

    await saveChangesAtSalesforce(page);

    await closeContextWhenAgentStringUsed(context, browser);

    return {
      success: true,
      message: "Process completed successfully checked at SalesForce",
      customer,
    };
  } catch (error) {
    console.log("Error during checkProcessCompletedAtSalesForce", error);
    return {
      success: false,
      nmessage: "Salesforce completed process check failed",
      customer,
    };
  }
};

// checkProcessCompletedAtSalesForce();

export default checkProcessCompletedAtSalesForce;
