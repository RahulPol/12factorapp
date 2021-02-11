const path = require("path");
const fs = require("fs");
const { PORT } = require("./constants");

exports.getBaseURL = (req) => {
  return (
    req.protocol +
    "://" +
    req.host +
    (process.env.PORT == 80 || process.env.PORT == 443
      ? ""
      : ":" + process.env.PORT)
  );
};

exports.clearImage = (filePath) => {
  filePath = path.join(
    __dirname,
    "..",
    "public\\images",
    filePath.substr(filePath.lastIndexOf("\\") + 1, filePath.length)
  );
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};
