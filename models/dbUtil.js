const mongoose = require("mongoose");

const constants = require("../common/constants");
const MongoUtil = require("./mongoUtil");

const connectToMongodb = (databaseUri) => {
  // connect to mongodb
  return mongoose.connect(databaseUri);
};

const connectToMySql = (databaseUri) => {
  // connect to mysql
  // this project is for demo purpose so returning reject for now.
  return Promise.reject("No config present for mysql, yet!");
};

exports.connectDB = (database, databaseUri) => {
  switch (database) {
    case "mongodb":
      return connectToMongodb(databaseUri);
    case "mySql":
      return connectToMySql(databaseUri);
    default:
      return Promise.reject("Invalid database");
  }
};

exports.getDbInstance = (database) => {
  let error;
  let IDatabase;
  switch (database) {
    case "mongodb":
      IDatabase = MongoUtil.getModels();
      return IDatabase;
    case "mySql":
      error = new Error("No config present for mysql, yet!");
      error.statusCode = constants.HTTP_INTERNAL_SERVER_ERROR;
      throw error;
    default:
      error = new Error("Invalid database");
      error.statusCode = constants.HTTP_INTERNAL_SERVER_ERROR;
      throw error;
  }
};

exports.closeConnection = (database) => {
  switch (database) {
    case "mongodb":
      mongoose.connection.close();
      break;

    default:
      error = new Error("Invalid database");
      error.statusCode = constants.HTTP_INTERNAL_SERVER_ERROR;
      throw error;
  }
};
