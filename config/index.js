let config;
switch (process.env.NODE_ENV) {
  case "production":
    config = require("./prod.env.js");
    break;
  case "qa":
    config = require("./qa.env.js");
    break;
  default:
    config = require("./dev.env.js");
    break;
}

export default config;
