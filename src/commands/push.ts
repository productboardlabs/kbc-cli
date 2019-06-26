import * as fs from "fs";
import { Command, flags } from "@oclif/command";

import { push, getConfig } from "../lib/keboolaHttpApi";

export default class Push extends Command {
  static description = "push transformation to Keboola";

  static flags = {
    help: flags.help({ char: "h" }),
    verbose: flags.boolean({ char: "v", description: "print response" }),
    dryRun: flags.boolean({
      char: "n",
      description: "show what would be have been pushed"
    })
  };

  // @ts-ignore
  check(storedConfig, activeConfig) {
    delete activeConfig.queries;
    return JSON.stringify(storedConfig) === JSON.stringify(activeConfig);
  }

  async run() {
    const { flags } = this.parse(Push);

    if (
      !fs.existsSync("../.bucket-config.json") ||
      !fs.existsSync(".transformation-config.json")
    ) {
      this.error("");
    }

    const bucketConfig = JSON.parse(
      fs.readFileSync("../.bucket-config.json").toString()
    );
    const transformation = JSON.parse(
      fs.readFileSync(".transformation-config.json").toString()
    );

    if (transformation.configuration.type !== "simple") {
      this.error("Currently only SQL queries are supported.");
    }

    const activeTransformation = await getConfig(
      bucketConfig.id,
      transformation.id
    );

    if (
      !this.check(
        transformation.configuration,
        activeTransformation.configuration
      )
    ) {
      this.error(
        "Local and active configuration of the pushed transformation differ. Run `kbc-cli pull` first."
      );
    }

    let codeFile = "queries.sql";
    const code = fs.readFileSync(codeFile).toString();
    transformation.configuration.queries = [code.replace(/\n$/, "")];

    if (!flags.dryRun) {
      const response = await push(bucketConfig.id, transformation);

      if (flags.verbose) {
        this.log(response);
      }
    }

    this.log(
      `\nTransformation \`${transformation.name}\` (id: ${
        transformation.id
      }) pushed`
    );
  }
}
