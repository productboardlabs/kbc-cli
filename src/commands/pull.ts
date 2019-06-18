import * as fs from "fs";
import { Command, flags } from "@oclif/command";

import { pull } from "../lib/keboolaHttpApi";

export default class Pull extends Command {
  static description = "pull all transformations and store them locally";

  static flags = {
    help: flags.help({ char: "h" }),
    outDir: flags.string({
      char: "o",
      description: "[default: transformations]"
    })
  };

  writeToFiles(bucketsWithTransformations) {
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
          transformation.configuration.queries.join("\n")
        );
      });

      delete bucketConfig.rows;

      fs.writeFileSync(
        `${bucketDir}/config.json`,
        JSON.stringify(bucketConfig, null, 2)
      );
    });

    return transformationCount;
  }

  async run(outDir = "./transformations") {
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }

    process.chdir(outDir);

    const { flags } = this.parse(Pull);

    await pull().then(bucketsWithTransformations => {
      const transformationCount = this.writeToFiles(bucketsWithTransformations);
      this.log(`${transformationCount} transformations written to ${outDir}.`);
    });
  }
}
