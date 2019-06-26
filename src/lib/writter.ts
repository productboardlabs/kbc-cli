import * as fs from "fs";

// @ts-ignore
export const store = (configs, console: console) => {
  const INITIAL_PATH = __dirname;
  let maxDepth = 5;

  while (maxDepth) {
    if (fs.existsSync(".kbc-cli")) {
      break;
    }

    process.chdir("../");
    maxDepth -= 1;
  }

  if (!maxDepth) {
    console.error("Project root not found");
    return;
  }

  process.chdir("transformations");

  let writtenCount = 0;

  // @ts-ignore
  configs.forEach(bucketConfig => {
    const bucketDir = bucketConfig.name.replace(/\//g, "");

    if (!fs.existsSync(bucketDir)) {
      fs.mkdirSync(bucketDir);
    }
    // @ts-ignore
    bucketConfig.rows.forEach(transformation => {
      const transformationDir = transformation.name.replace(/\//g, "");

      if (!fs.existsSync(`${bucketDir}/${transformationDir}`)) {
        fs.mkdirSync(`${bucketDir}/${transformationDir}`);
      }

      let codeFile = "queries.sql";

      if (transformation.configuration.type === "python") {
        codeFile = "script.py";
      }

      fs.writeFileSync(
        `${bucketDir}/${transformationDir}/${codeFile}`,
        transformation.configuration.queries.join("\n\n")
      );

      console.log(`* ${bucketDir}/${transformationDir}`);

      delete transformation.configuration.queries;

      fs.writeFileSync(
        `${bucketDir}/${transformationDir}/.transformation-config.json`,
        JSON.stringify(transformation, null, 2)
      );
    });

    writtenCount += bucketConfig.rows.length;
    delete bucketConfig.rows;

    fs.writeFileSync(
      `${bucketDir}/.bucket-config.json`,
      JSON.stringify(bucketConfig, null, 2)
    );
  });

  process.chdir(INITIAL_PATH);

  return writtenCount;
};

export default {
  store
};
