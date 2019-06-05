const fetch = require("node-fetch");
const fs = require("fs");
const FormData = require("form-data");

process.chdir(
  "keboola-transformations/[sandbox] Dušan Lago/Unify Salesforce Contact"
);

const bucketConfigJson = fs.readFileSync("../config.json").toString();
const bucketConfig = JSON.parse(bucketConfigJson);

const configJson = fs.readFileSync("config.json").toString();
const config = JSON.parse(configJson);

let codeFile = "queries.sql";

// if (config.configuration.type === "python") {
//   codeFile = "script.py";
// }

const code = fs.readFileSync(codeFile).toString();

config.configuration.queries = [code];

(async () => {
  const response = await fetch(
    `https://connection.keboola.com/v2/storage/components/transformation/configs/${
      bucketConfig.id
    }/rows/${config.id}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-storageapi-token": process.env["KEBOOLA_TOKEN"]
      },
      body: `configuration=${encodeURIComponent(
        JSON.stringify(config.configuration)
      )}&changeDescription=Change%20Queries%20in%20Unify%20Salesforce%20Contact`
    }
  ).then(res => res.json());
})().catch(err => {
  console.log(err);
});
