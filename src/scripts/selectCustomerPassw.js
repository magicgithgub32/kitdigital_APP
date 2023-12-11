const MyImap = require("./myImap");
const {
  initContext,
  closeContext,
  delay,
  createEmailFromCustomerNIF,
} = require("./robodec");
require("dotenv").config();

const imapConfig = {
  imap: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    tls: process.env.EMAIL_TLS === "true",
  },
  debug: console.log,
};

const myImap = new MyImap(imapConfig);

const MAX_ATTEMPTS = 10;

const processLink = async (page, link, customer) => {
  console.log("Following passwordLink:", link);
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  };

  let email = createEmailFromCustomerNIF(customer);

  await page.setExtraHTTPHeaders(headers);

  await page.goto(link);

  await delay(3000);

  await page.getByRole("textbox", { name: "Contraseña", exact: true }).click();
  await delay(1000);
  await page
    .getByRole("textbox", { name: "Contraseña", exact: true })
    .fill(`c0N7rA${customer.NIF_NIE}##<@>?!`);

  await delay(3000);

  await page.getByRole("textbox", { name: "Confirmar contraseña" }).click();
  await delay(1000);
  await page
    .getByRole("textbox", { name: "Confirmar contraseña" })
    .fill(`c0N7rA${customer.NIF_NIE}##<@>?!`);

  await page.getByLabel(`Guarda y accede como ${email}`).click();

  //?PROBANDO ESTO:
  return { success: true, message: "Account activation link processed" };
};

const selectCustomerPassw = async (customer) => {
  try {
    await myImap.connect();
    console.log("Connected");

    await myImap.openBox("INBOX");

    const searchCriteria = ["UNSEEN"];
    let emails = await myImap.fetchEmails(searchCriteria);

    emails.sort((a, b) => new Date(b.date) - new Date(a.date));

    const newestEmail = emails[0];

    if (newestEmail) {
      console.log("Subject:", newestEmail.subject);
      console.log("From:", newestEmail.from_address);
      console.log("Date:", newestEmail.date);
      console.log("Body:", newestEmail.body);

      const passwordLink = newestEmail.body.match(/https?:\/\/[^\s]+/)?.[0];

      if (passwordLink) {
        console.log("Following passwordLink:", passwordLink);

        const { page, browser } = await initContext({ link: passwordLink });
        const result = await processLink(page, passwordLink, customer);

        await closeContext(browser);
        await myImap.end();

        return {
          success: true,
          message: "Activated account successfully",
          customer,
        };
      } else {
        return {
          success: false,
          message: "No activation link found in emails",
        };
      }
    }

    await myImap.end();
    return {
      success: false,
      message: "Error while checking activation link in mailbox",
    };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Account activation failed" };
  }
};

const startListening = (customer) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const intervalId = setInterval(async () => {
      try {
        const result = await selectCustomerPassw(customer);

        if (result) {
          clearInterval(intervalId);
          resolve(result);
        } else {
          attempts++;
          if (attempts >= MAX_ATTEMPTS) {
            clearInterval(intervalId);
            reject(
              new Error(
                `Max attempts reached. Could not find the email with the link for customer: ${customer.name}`
              )
            );
          }
        }
      } catch (error) {
        clearInterval(intervalId);
        reject(error);
      }
    }, 30000);
  });
};

// selectCustomerPassw();
module.exports = selectCustomerPassw;
// module.exports = startListening;
