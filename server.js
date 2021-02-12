const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const jsyaml = require("js-yaml");
const path = require("path");
const multer = require("multer");
const uuid = require("uuid");
require("dotenv").config();
var morgan = require("morgan");

const spec = fs.readFileSync(path.join(__dirname, "swagger.yml"), "utf-8");
const feedRoutes = require("./routes/feedRoutes");
const authRoutes = require("./routes/authRoutes");
const funRoutes = require("./routes/funRoutes");
const constants = require("./common/constants");
const config = require("./common/config");
const dbUtil = require("./models/dbUtil");
let server = undefined;

const app = express();
app.set("view engine", "pug");

const configInstance = new config();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, uuid.v4() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(morgan("combined"));
// app.use(bodyParser.urlencoded()) // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
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
app.use("/v1/auth", authRoutes);
app.use("/v1/fun", funRoutes);

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

const db = dbUtil
  .connectDB(configInstance.get("DATABASE"), configInstance.get("DATABASE_URI"))
  .then(() => {
    server = app.listen(configInstance.get("PORT"), () => {
      console.log("Server started!");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Handle ^C
process.on("SIGINT", function () {
  console.log("Shutdown gracefully");
  if (server) {
    server.close();
  }
  if (db) {
    dbUtil.closeConnection(configInstance.get("DATABASE"));
  }

  process.exit();
});
