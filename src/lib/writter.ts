import * as fs from "fs";

export const store = (
  // @ts-ignore
  configs,
  // @ts-ignore
  rootPath,
  // @ts-ignore
  console = console,
  configOnly = false
) => {
  const basePath = `${rootPath}/transformations`;

  let writtenCount = 0;

  // @ts-ignore
  configs.forEach(bucketConfig => {
    const bucketDir = `${basePath}/${bucketConfig.name.replace(/\//g, "")}`;

    if (!fs.existsSync(bucketDir)) {
      fs.mkdirSync(bucketDir);
    }
    // @ts-ignore
    bucketConfig.rows.forEach(transformation => {
      const transformationDir = `${bucketDir}/${transformation.name.replace(
        /\//g,
        ""
      )}`;

      if (!fs.existsSync(transformationDir)) {
        fs.mkdirSync(transformationDir);
      }

      let codeFile = "queries.sql";

      if (transformation.configuration.type === "python") {
        codeFile = "script.py";
      }

      !configOnly &&
        fs.writeFileSync(
          `${transformationDir}/${codeFile}`,
          transformation.configuration.queries.join("\n\n")
        );

      console.log(`* ${transformationDir}`);

      delete transformation.configuration.queries;

      fs.writeFileSync(
        `${transformationDir}/.transformation-config.json`,
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

  return writtenCount;
};

export default {
  store
};
