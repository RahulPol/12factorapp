const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const jsyaml = require("js-yaml");
const path = require("path");
const mongoose = require("mongoose");

const spec = fs.readFileSync(path.join(__dirname, "swagger.yml"), "utf-8");
const feedRoutes = require("./routes/feedRoutes");
const constants = require("./common/constants");

const app = express();
app.set("view engine", "pug");

// app.use(bodyParser.urlencoded()) // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, HEAD"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/v1/feed", feedRoutes);

const swaggerDocument = jsyaml.load(spec);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res, next) => {
  res.render("index");
});

// error handling middleware
app.use((error, req, res, next) => {
  const { statusCode = constants.HTTP_INTERNAL_SERVER_ERROR, message } = error;
  if (statusCode == constants.HTTP_VALIDATION_FAILED) {
    const { errors = [] } = error;
    return res.status(statusCode).json({ message, errors });
  }

  res.status(statusCode).json({ code: statusCode, message });
});

mongoose
  .connect(
    "mongodb+srv://rahul-pol:adminadmin@cluster0.ppeta.mongodb.net/messages?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(process.env.PORT || constants.PORT, () => {
      console.log("Server started!");
    });
  })
  .catch((err) => {
    console.log(err);
  });
