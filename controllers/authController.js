const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const constants = require("../common/constants");
const dbUtil = require("../models/dbUtil");
const mongoUtil = require("../models/mongoUtil");

let IDatabase = dbUtil.getDbInstance(process.env.DATABASE);

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error("Validation failed. Entered data is incorrect! ");
    error.statusCode = constants.HTTP_VALIDATION_FAILED;
    error.errors = errors.array();
    throw error;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt
    .hash(password, process.env.BCRYPT_SALT)
    .then((hashedPw) => {
      return IDatabase.Auth.createUser({ name, email, password: hashedPw });
    })
    .then((result) => {
      res
        .status(constants.HTTP_CREATED)
        .json({ message: "User created!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = constants.HTTP_INTERNAL_SERVER_ERROR;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  IDatabase.Auth.getUser({ email, password })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not be found!");
        error.statusCode = constants.HTTP_UNAUTHORIZED;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = constants.HTTP_UNAUTHORIZED;
        throw error;
      }

      const token = jwt.sign(
        {
          userName: loadedUser.name,
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        constants.JWT_SECRET,
        { expiresIn: constants.JWT_EXPIRES_IN }
      );
      res.status(constants.HTTP_OK).json({ token });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = constants.HTTP_INTERNAL_SERVER_ERROR;
      }
      next(err);
    });
};
