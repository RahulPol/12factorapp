const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const jsyaml = require("js-yaml");
const path = require("path");

const spec = fs.readFileSync(path.join(__dirname, "swagger.yml"), "utf-8");
const swaggerDocument = jsyaml.load(spec);
const feedRoutes = require("./routes/feedRoutes");

const app = express();

// app.use(bodyParser.urlencoded()) // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use("/v1/feed", feedRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(8080, () => {
  console.log("Server started!");
});
