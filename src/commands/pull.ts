import * as fs from "fs";
import { Command, flags } from "@oclif/command";

import { getTransformations } from "../lib/keboolaHttpApi";
import { store } from "../lib/writter";
import resolveContext from "../lib/resolveContext";

interface BucketConfig {
  id: number;
  rows: Array<{}>;
}

export default class Pull extends Command {
  static description = "pull transformations and store them locally";

  static flags = {
    help: flags.help(),
    configOnly: flags.boolean({
      description: "pull only configurations without queries or scripts"
    })
  };

  async run() {
    const { flags } = this.parse(Pull);

    let context;
    try {
      context = resolveContext();
    } catch (error) {
      this.error(error.message);
      return;
    }

    let configs: Array<BucketConfig> = await getTransformations();

    if (context.type === "bucket") {
      const storedBucketConfig = JSON.parse(
        fs.readFileSync(context.configFile).toString()
      );

      configs = configs.filter(
        bucketConfig => bucketConfig.id === storedBucketConfig.id
      );
    }

    if (context.type === "transformation") {
      const storedTransformationConfig = JSON.parse(
        fs.readFileSync(context.configFile).toString()
      );

      // @ts-ignore
      let filteredConfigs = [];

      for (let bucketConfig of configs) {
        bucketConfig.rows = bucketConfig.rows.filter(
          // @ts-ignore
          transformation => transformation.id === storedTransformationConfig.id
        );

        if (bucketConfig.rows.length) {
          filteredConfigs = [bucketConfig];
          break;
        }
      }

      // @ts-ignore
      configs = filteredConfigs;
    }

    const writtenCount = store(
      configs,
      context.rootPath,
      this,
      flags.configOnly
    );
    this.log(`\nPulled ${writtenCount} transformation(s).`);
  }
}
