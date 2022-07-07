const fs = require("fs");
const path = require("path");
const jsYaml = require("js-yaml");

const configsDir = path.join(__dirname, "configs");

const configs = fs.readdirSync(configsDir);

configs.forEach((configName) => {
  const prettierConfig = jsYaml.load(
    fs.readFileSync(path.join(configsDir, configName), "utf8")
  );

  const outputConfigName =
    configName.substr(0, configName.lastIndexOf(".")) + ".js";

  fs.writeFileSync(
    path.join(__dirname, outputConfigName),
    "module.exports = " + JSON.stringify(prettierConfig, null, 2)
  );
});
