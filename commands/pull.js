const fs = require("fs");
const defaults = require("../lib/defaults");
const keboolaHttpApi = require("../lib/keboolaHttpApi");

const writeToFiles = bucketsWithTransformations => {
  let transformationCount = 0;

  bucketsWithTransformations.forEach(bucketConfig => {
    const bucketDir = bucketConfig.name.replace(/\//g, "");

    if (!fs.existsSync(bucketDir)) {
      fs.mkdirSync(bucketDir);
    }

    bucketConfig.rows.forEach(transformation => {
      transformationCount++;
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

  return transformationCount;
};

const pull = (outDir = "./transformations") => {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  process.chdir(outDir);

  return keboolaHttpApi.pull().then(bucketsWithTransformations => {
    const transformationCount = writeToFiles(bucketsWithTransformations);
    console.log(`${transformationCount} transformations written to ${outDir}.`);
  });
};

module.exports = pull;
