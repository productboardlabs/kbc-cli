import * as fs from "fs";
import { Command, flags } from "@oclif/command";

import { push } from "../lib/keboolaHttpApi";

export default class Push extends Command {
  static description = "push transformation to Keboola";

  static flags = {
    help: flags.help({ char: "h" }),
    verbose: flags.boolean({ char: "v", description: "print response" })
  };

  async run() {
    const { flags } = this.parse(Push);

    const bucketConfig = JSON.parse(fs.readFileSync("../.config").toString());
    const transformation = JSON.parse(fs.readFileSync(".config").toString());

    if (transformation.configuration.type !== "simple") {
      this.error("Only SQL scripts are currently supported.");
    }

    let codeFile = "queries.sql";
    const code = fs.readFileSync(codeFile).toString();
    transformation.configuration.queries = [code.replace(/\n$/, "")];

    const response = await push(bucketConfig.id, transformation);

    if (flags.verbose) {
      this.log(response);
    }
  }
}
