import * as fs from "fs";
import { Command, flags } from "@oclif/command";

import { getConfigs } from "../lib/keboolaHttpApi";
import { store } from "../lib/writter";

export default class Init extends Command {
  static description = "initialize local Keboola project";

  static flags = {
    help: flags.help({ char: "h" })
  };

  async run() {
    [".kbc-cli", "transformations"].forEach(
      dir => !fs.existsSync(dir) && fs.mkdirSync(dir)
    );

    const configs = await getConfigs();
    const writtenCount = store(configs, this);
    this.log(`\nInitialized project with ${writtenCount} transformation(s)`);
  }
}
