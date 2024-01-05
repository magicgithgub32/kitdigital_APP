const readXlx = require("./excel-reader");
const requestBono = require("./requestBono");
const checkProcessCompletedAtSalesForce = require("./checkProcessCompletedAtSalesforce");

const processRequestBonoGeneral = async (uploadedFilePath) => {
  try {
    let customers = await readXlx(uploadedFilePath);

    customers = customers.filter(
      (customer) =>
        customer.KD_Substage === "Listo para tramitar" ||
        customer.KD_Substage === "Listo para tramitar " ||
        customer.KD_Substage === "En proceso"
    );

    const results = [];
    for (const customer of customers) {
      let result = { customer, flow: {} };

      const bonoRequested = await requestBono(customer);
      result.flow.bonoRequested = bonoRequested;

      if (bonoRequested && bonoRequested.success) {
        const processCompleted = await checkProcessCompletedAtSalesForce(
          customer
        );
        result.flow.processCompleted = processCompleted;
      }

      results.push(result);
    }
    console.log(JSON.stringify(results, null, 2));
    return results;
  } catch (error) {
    console.error("Error in processRequestBono:", error);
    return [];
  }
};

module.exports = processRequestBonoGeneral;
