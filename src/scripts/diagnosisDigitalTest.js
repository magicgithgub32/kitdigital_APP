const {
  delay,
  initContextWithAgentString,
  selectTestToPassInAceleraPyme,
  selectGotById,
  selectGotByRole,
  loginInAceleraPyme,
  closeContextWhenAgentStringUsed,
  clickSiguienteBySelector,
  selectCheckedByRadioAndSiguiente,
  numRandomValue,
} = require("./robodec");

const autodiagnosis_URL = "https://www.acelerapyme.gob.es";

const diagnosisDigitalTest = async (customer) => {
  console.log("customer.Nombre", customer.Nombre);
  const firstName = customer.Nombre.split(" ")[0].trim();
  const firstNameArr = firstName.split("");

  try {
    const { page, context, browser } = await initContextWithAgentString({
      url: autodiagnosis_URL,
    });

    await loginInAceleraPyme(page, autodiagnosis_URL, customer);

    await selectTestToPassInAceleraPyme(page, {
      accessibleName: "Test de diagnóstico digital",
    });

    if (firstNameArr.length > 5) {
      await selectCheckedByRadioAndSiguiente(
        "input#edit-p1-radios-p1r1",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p2-radios-p2r1",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p3-radios-p3r1",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p4-radios-p4r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p5-radios-p5r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p6-radios-p6r1",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p7-radios-p7r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p8-radios-p8r1",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p9-radios-p9r1",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p10-radios-p10r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectGotById(page, "#edit-p12-radios", "No");

      await clickSiguienteBySelector(
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectGotByRole(
        page,
        "spinbutton",
        "¿Cuál es el volumen de negocio de tu comercio electrónico? Indica el porcentaje de volumen de negocio: _________%"
      );

      await page
        .getByRole("spinbutton", {
          name: "¿Cuál es el volumen de negocio de tu comercio electrónico? Indica el porcentaje de volumen de negocio: _________%",
        })
        .fill(numRandomValue([2, 10, 20]));
    } else if (firstNameArr.length == 3) {
      await selectCheckedByRadioAndSiguiente(
        "input#edit-p1-radios-p1r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p2-radios-p2r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p3-radios-p3r1",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p4-radios-p4r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p5-radios-p5r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p6-radios-p6r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p7-radios-p7r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p8-radios-p8r1",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p9-radios-p9r1",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p10-radios-p10r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectGotById(page, "#edit-p12-radios", "No");

      await clickSiguienteBySelector(
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectGotByRole(
        page,
        "spinbutton",
        "¿Cuál es el volumen de negocio de tu comercio electrónico? Indica el porcentaje de volumen de negocio: _________%"
      );

      await page
        .getByRole("spinbutton", {
          name: "¿Cuál es el volumen de negocio de tu comercio electrónico? Indica el porcentaje de volumen de negocio: _________%",
        })
        .fill(numRandomValue([3, 6, 9]));
    } else {
      await selectCheckedByRadioAndSiguiente(
        "input#edit-p1-radios-p1r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p2-radios-p2r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p3-radios-p3r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p4-radios-p4r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p5-radios-p5r1",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p6-radios-p6r1",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p7-radios-p7r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p8-radios-p8r1",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p9-radios-p9r1",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectCheckedByRadioAndSiguiente(
        "input#edit-p10-radios-p10r2",
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectGotById(page, "#edit-p12-radios", "No");

      await clickSiguienteBySelector(
        page,
        "div.btn-primary.button_next_question_test.button-next.button-strategy"
      );

      await selectGotByRole(
        page,
        "spinbutton",
        "¿Cuál es el volumen de negocio de tu comercio electrónico? Indica el porcentaje de volumen de negocio: _________%"
      );

      await page
        .getByRole("spinbutton", {
          name: "¿Cuál es el volumen de negocio de tu comercio electrónico? Indica el porcentaje de volumen de negocio: _________%",
        })
        .fill(numRandomValue([10, 15, 20, 25, 35, 45, 55, 60, 65, 70, 75]));
    }

    await delay(6000);
    await selectGotByRole(page, "button", "Siguiente");

    await delay(2000);
    await closeContextWhenAgentStringUsed(context, browser);

    return {
      success: true,
      message: "Autodiagnosis test successful",
      customer,
    };
  } catch (error) {
    console.error("Error during autodiagnosis test process:", error);
    return {
      success: false,
      message: "Autodiagnosis test failed",
      customer,
    };
  }
};

// diagnosisDigitalTest();
module.exports = diagnosisDigitalTest;
