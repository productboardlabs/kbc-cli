import * as fs from "fs";
import { Command, flags } from "@oclif/command";

import { getConfigs } from "../lib/keboolaHttpApi";
import { AnyARecord } from "dns";
import { thisExpression } from "@babel/types";

export default class Pull extends Command {
  static description = "pull all transformations and store them locally";

  static args = [{ name: "transformationId" }];

  static flags = {
    help: flags.help({ char: "h" }),
    outDir: flags.string({
      char: "o",
      description: "[default: transformations]"
    }),
    all: flags.boolean({ char: "a" })
  };

  // @ts-ignore
  writeToFiles(configs) {
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

        this.log(`* ${bucketDir}/${transformationDir}`);

        delete transformation.configuration.queries;

        fs.writeFileSync(
          `${bucketDir}/${transformationDir}/.config`,
          JSON.stringify(transformation, null, 2)
        );
      });

      writtenCount += bucketConfig.rows.length;
      delete bucketConfig.rows;

      fs.writeFileSync(
        `${bucketDir}/.config`,
        JSON.stringify(bucketConfig, null, 2)
      );
    });

    return writtenCount;
  }

  async run() {
    const { flags, args } = this.parse(Pull);
    const outDir = flags.outDir || "./";

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }

    process.chdir(outDir);

    let configs = await getConfigs();

    if (!flags.all) {
      if (!args.transformationId) {
        this.error(
          "transformation id not provided. Use `kbc-cli ls` to determine it or pull all transformation with `--all`."
        );
      }

      for (let bucketConfig of configs) {
        bucketConfig.rows = bucketConfig.rows.filter(
          // @ts-ignore
          transformation => transformation.id === args.transformationId
        );

        if (bucketConfig.rows.length) {
          configs = [bucketConfig];
          break;
        }
      }
    }

    this.log("Writting transformations:\n");
    const writtenCount = this.writeToFiles(configs);
    this.log(`\n${writtenCount} transformation(s) written to ${outDir}`);
  }
}
