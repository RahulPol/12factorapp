const { PORT } = require("./constants");

exports.getBaseURL = (req) => {
  return (
    req.protocol +
    "://" +
    req.host +
    (process.env.PORT == 80 || process.env.PORT == 443 ? "" : ":" + PORT)
  );
};
