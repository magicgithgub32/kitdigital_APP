const readXlx = require("./excel-reader");
const registerInAceleraPyme = require("./registerInAceleraPyme");
const checkRegisteredInAceleraPymeInSalesforce = require("./checkRegisteredInAceleraPymeInSalesforce");
const emailListener = require("./selectCustomerPassw");
const checkAceleraPymeAccountActivatedInSalesforce = require("./checkAceleraPymeAccountActivatedInSalesforce");
// const ciberSeguridadTest = require("./ciberSeguridadTest");
// const transfDigitalTest = require("./transfDigitalTest");
const diagnosisDigitalTest = require("./diagnosisDigitalTest");
const checkReadyToRequestBonoAtSalesforce = require("./checkReadyToRequestBonoAtSalesforce");
const requestBono = require("./requestBono");
const checkProcessCompletedAtSalesForce = require("./checkProcessCompletedAtSalesforce");

async function requestKitDigital(uploadedFilePath) {
  try {
    let customers = await readXlx(uploadedFilePath);

    customers = customers.filter(
      (customer) =>
        customer.KD_Substage === "Listo para tramitar" ||
        customer.KD_Substage === "Listo para tramitar "
    );

    const results = [];
    for (const customer of customers) {
      let result = { customer, flow: {} };

      const registeredInAceleraPyme = await registerInAceleraPyme(customer);
      result.flow.registeredInAceleraPyme = registeredInAceleraPyme;
      result.phoneInfo = registeredInAceleraPyme.phoneInfo;

      let checkedRegisteredInAceleraPymeInSalesforce;
      let checkedAceleraPymeAccountActivatedAtSalesforce;
      let readyToRequestBonoAtSalesforceChecked;
      let checkedProcessCompletedAtSalesForce;

      if (registeredInAceleraPyme?.success) {
        checkedRegisteredInAceleraPymeInSalesforce =
          await checkRegisteredInAceleraPymeInSalesforce(customer);
      }
      result.flow.checkedRegisteredInAceleraPymeInSalesforce =
        checkedRegisteredInAceleraPymeInSalesforce;

      const selectedCustomerPassw = await emailListener(customer);
      result.flow.selectedCustomerPassw = selectedCustomerPassw;

      if (selectedCustomerPassw && selectedCustomerPassw.success) {
        checkedAceleraPymeAccountActivatedAtSalesforce =
          await checkAceleraPymeAccountActivatedInSalesforce(customer);
      }

      result.flow.checkedAceleraPymeAccountActivatedAtSalesforce =
        checkedAceleraPymeAccountActivatedAtSalesforce;

      const autodiagnosisTestPassed = await diagnosisDigitalTest(customer);
      result.flow.autodiagnosisTestPassed = autodiagnosisTestPassed;

      if (autodiagnosisTestPassed && autodiagnosisTestPassed.success) {
        readyToRequestBonoAtSalesforceChecked =
          await checkReadyToRequestBonoAtSalesforce(customer);
      }
      result.flow.readyToRequestBonoAtSalesforceChecked =
        readyToRequestBonoAtSalesforceChecked;

      // const bonoRequested = await requestBono(customer);
      // result.flow.bonoRequested = bonoRequested;

      // if (bonoRequested && bonoRequested.flow.success) {
      //   checkedProcessCompletedAtSalesForce =
      //     await checkProcessCompletedAtSalesForce(customer);
      // }
      // result.flow.checkedProcessCompletedAtSalesForce =
      //   checkedProcessCompletedAtSalesForce;

      results.push(result);
    }
    console.log(JSON.stringify(results, null, 2));
    return results;
  } catch (error) {
    console.error("Error reading or processing excel file:", error);
    return [];
  }
}

module.exports = requestKitDigital;
