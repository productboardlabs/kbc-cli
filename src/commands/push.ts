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

    const bucketConfig = JSON.parse(
      fs.readFileSync("../config.json").toString()
    );
    const transformation = JSON.parse(
      fs.readFileSync("config.json").toString()
    );

    let codeFile = "queries.sql";

    if (transformation.configuration.type === "python") {
      codeFile = "script.py";
    }

    const code = fs.readFileSync(codeFile).toString();

    transformation.configuration.queries = [code];

    const response = await push(bucketConfig.id, transformation);

    if (flags.verbose) {
      this.log(response);
    }
  }
}
