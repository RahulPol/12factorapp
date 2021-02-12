const jwt = require("jsonwebtoken");

const constants = require("../common/constants");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated!");
    error.statusCode = constants.HTTP_UNAUTHORIZED;
    throw error;
  }

  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, constants.JWT_SECRET);
  } catch (err) {
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated!");
    error.statusCode = constants.HTTP_UNAUTHORIZED;
    throw error;
  }

  req.userId = decodedToken.userId;
  req.userName = decodedToken.userName;

  next();
};
