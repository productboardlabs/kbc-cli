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
    const codeAsArray = [];

    const reg = /(.*?;\n*)\n{2}/gs;
    let match = null;
    while ((match = reg.exec(code))) {
      codeAsArray.push(match[1]);
    }

    transformation.configuration.queries = codeAsArray;

    const response = await push(bucketConfig.id, transformation);

    if (flags.verbose) {
      this.log(response);
    }
  }
}
