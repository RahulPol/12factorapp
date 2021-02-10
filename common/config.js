const constants = require("./constants");

//singleton implementation of the config class
class Config {
  constructor() {
    if (Config.instance instanceof Config) {
      return Config.instance;
    }

    this.configObject = {
      HOST: process.env.HOST,
      PORT: process.env.PORT,
      DATABASE_URI: process.env.DATABASE_URI,
    };

    // we don't want anyone to update the configObject, so lets freez it.
    Object.freeze(this.configObject);

    // also we don't want anyone to update this instance itself by adding/removing properties to it,
    // so lets freez this instance as well
    Object.freeze(this);

    // For singleton we will require a static property which we can set to this instance,
    // which is nothing but class level property
    Config.instance = this;
  }

  get(key) {
    console.log(this.configObject);
    console.log(key);
    return this.configObject[key];
  }
}

module.exports = Config;
