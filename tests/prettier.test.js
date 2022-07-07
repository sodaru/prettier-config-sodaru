const Ajv = require("ajv");
const defaultPrettierConfig = require("../index");
const https = require("https");
const migrate = require("json-schema-migrate");

let fetchPromise = null;

const fetchPrettierSchema = () => {
  if (fetchPromise == null) {
    fetchPromise = new Promise((resolve, reject) => {
      https
        .get("https://json.schemastore.org/prettierrc.json", (res) => {
          let data = "";
          res.on("data", (d) => {
            data += d;
          });

          res.on("end", () => {
            const schema = JSON.parse(data);
            migrate.draft7(schema);
            resolve(schema);
          });
        })
        .on("error", (e) => {
          reject(e);
        });
    });
  }
  return fetchPromise;
};

const getAjvValidator = async () => {
  const ajv = new Ajv();
  const schema = await fetchPrettierSchema();
  const original = console.warn;
  console.warn = jest.fn();
  const validate = ajv.compile(schema);
  console.warn = original;
  return validate;
};

describe("Test prettier config files", () => {
  test("validate default config", async () => {
    expect.assertions(1);
    const validate = await getAjvValidator();
    const isValid = validate(defaultPrettierConfig);
    if (validate.errors) {
      validate.errors.map(console.error);
    }
    expect(isValid).toBeTruthy();
  });
});
