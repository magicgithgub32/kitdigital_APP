require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./src/api/routes/file-routes");
const server = express();
const PORT = Number(process.env.PORT);

// server.use(
//   cors({
//     origin: "https://declarando-kit-digital.netlify.app/",
//   })
// );
server.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
  })
);

server.use(express.json({ limit: "5mb" }));
server.use(express.urlencoded({ limit: "5mb", extended: false }));

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-type");
  next();
});

server.disable("x-powered-by");

server.use("/api", router);

server.use("*", (req, res, next) => {
  return res.status(404).json("Route not found 🙈");
});

server.listen(PORT, () => {
  console.log(`Server running in PORT ${PORT} 🏃🏻‍♀️`);
});
