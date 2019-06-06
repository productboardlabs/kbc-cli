const fs = require("fs");
const defaults = require("../lib/defaults");
const keboolaHttpApi = require("../lib/keboolaHttpApi");

const writeToFiles = bucketsWithTransformations => {
  bucketsWithTransformations.forEach(bucketConfig => {
    const bucketDir = bucketConfig.name.replace(/\//g, "");

    if (!fs.existsSync(bucketDir)) {
      fs.mkdirSync(bucketDir);
    }

    bucketConfig.rows.forEach(transformation => {
      const transformationDir = transformation.name.replace(/\//g, "");

      if (!fs.existsSync(`${bucketDir}/${transformationDir}`)) {
        fs.mkdirSync(`${bucketDir}/${transformationDir}`);
      }

      fs.writeFileSync(
        `${bucketDir}/${transformationDir}/config.json`,
        JSON.stringify(transformation, null, 2)
      );

      let codeFile = "queries.sql";

      if (transformation.configuration.type === "python") {
        codeFile = "script.py";
      }

      fs.writeFileSync(
        `${bucketDir}/${transformationDir}/${codeFile}`,
        transformation.configuration.queries.join()
      );
    });

    delete bucketConfig.rows;

    fs.writeFileSync(
      `${bucketDir}/config.json`,
      JSON.stringify(bucketConfig, null, 2)
    );
  });
};

const pull = (outDir = defaults.outDir) => {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  process.chdir(outDir);

  return keboolaHttpApi.pull().then(bucketsWithTransformations => {
    console.log(`Written to ${outDir}`);
    return writeToFiles(bucketsWithTransformations);
  });
};

module.exports = pull;
