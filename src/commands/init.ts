import * as fs from "fs";
import { Command, flags } from "@oclif/command";

import { getTransformations } from "../lib/keboolaHttpApi";
import { store } from "../lib/writter";

export default class Init extends Command {
  static description = "initialize local Keboola project";

  static flags = {
    help: flags.help()
  };

  async run() {
    [".kbc-cli", "transformations"].forEach(
      dir => !fs.existsSync(dir) && fs.mkdirSync(dir)
    );

    fs.writeFileSync(
      ".kbc-cli/config.json",
      JSON.stringify({ createdWith: "kbc-cli" })
    );

    const configs = await getTransformations();
    const writtenCount = store(configs, this);
    this.log(`\nInitialized project with ${writtenCount} transformation(s).`);
  }
}
