const fs = require("fs");
const keboolaHttpApi = require("../lib/keboolaHttpApi");

const push = (path = "./") => {
  process.chdir(path);
  const bucketConfig = JSON.parse(fs.readFileSync("../config.json").toString());
  const transformation = JSON.parse(fs.readFileSync("config.json").toString());

  let codeFile = "queries.sql";

  if (transformation.configuration.type === "python") {
    codeFile = "script.py";
  }
  const code = fs.readFileSync(codeFile).toString();

  transformation.configuration.queries = [code];

  return keboolaHttpApi.push(bucketConfig.id, transformation);
};

module.exports = push;
