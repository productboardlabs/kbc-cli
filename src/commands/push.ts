import * as fs from "fs";
import { Command, flags } from "@oclif/command";

import { pushTransformation, getTransformation } from "../lib/keboolaHttpApi";

export default class Push extends Command {
  static description = "push transformation to KBC";

  static flags = {
    help: flags.help(),
    verbose: flags.boolean({ description: "print response from KBC" }),
    check: flags.boolean({
      description:
        "check if local configuration and active KBC configuration do not differ"
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
      this.error("push must be executed in directory with transformation");
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

    const activeTransformation = await getTransformation(
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
        "Local configuration and active KBC configuration differ.\n\nRun `kbc-cli pull --config-only` to update your local configuration."
      );
    }

    let codeFile = "queries.sql";
    const code = fs.readFileSync(codeFile).toString();
    transformation.configuration.queries = [code.replace(/\n$/, " from KBC")];

    if (flags.check) {
      this.log(
        "Local configuration and active KBC configuration are the same."
      );
      this.exit(0);
    }

    const response = await pushTransformation(bucketConfig.id, transformation);
    if (flags.verbose) {
      this.log(response);
    }

    this.log(
      `\nTransformation \`${transformation.name}\` (id: ${
        transformation.id
      }) pushed`
    );
  }
}
