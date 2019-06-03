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
    const dirName = bucket.name.replace(/\//g, "");

    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
    }

    bucket.rows.forEach(transformation => {
      fs.writeFileSync(
        `${dirName}/${transformation.name.replace(/\//g, "")}.json`,
        JSON.stringify(transformation)
      );

      fs.writeFileSync(
        `${dirName}/${transformation.name.replace(/\//g, "")}.sql`,
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
