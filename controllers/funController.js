const constants = require("../common/constants");

exports.jokeOfTheDay = (req, res, next) => {
  console.log(req.userName);
  res
    .status(constants.HTTP_OK)
    .json({ joke: "most funny joke for you - " + req.userName });
};
