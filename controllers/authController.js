const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const constants = require("../common/constants");

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
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        name,
        email,
        password: hashedPw,
      });
      return user.save();
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
