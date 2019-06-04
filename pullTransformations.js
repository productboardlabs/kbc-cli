const fetch = require("node-fetch");
const fs = require("fs");

const rootDir = "keboola-transformations";

const createAndSetRootDir = () => {
  if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir);
  }
  process.chdir(rootDir);
};

const pullTransformations = async () => {
  const bucketsWithTransformations = await fetch(
    "https://connection.keboola.com/v2/storage/components/transformation/configs",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "X-Storageapi-Token": process.env["KEBOOLA_TOKEN"]
      }
    }
  ).then(res => res.json());

  return bucketsWithTransformations;
};

const writeToFiles = bucketsWithTransformations => {
  bucketsWithTransformations.forEach(bucket => {
    const bucketDir = bucket.name.replace(/\//g, "");

    if (!fs.existsSync(bucketDir)) {
      fs.mkdirSync(bucketDir);
    }

    bucket.rows.forEach(transformation => {
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
  });
};

(async () => {
  createAndSetRootDir();
  const bucketsWithTransformations = await pullTransformations();
  writeToFiles(bucketsWithTransformations);

  console.log(`Written to ./${rootDir}`);
})().catch(err => {
  console.log(err);
});
