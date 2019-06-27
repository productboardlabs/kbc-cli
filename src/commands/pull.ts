import * as fs from "fs";
import { Command, flags } from "@oclif/command";

import { getTransformations } from "../lib/keboolaHttpApi";
import { store } from "../lib/writter";

interface Context {
  type: string;
}

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

    let context: Context;

    if (fs.existsSync(".kbc-cli") || fs.existsSync("../.kbc-cli")) {
      context = {
        type: "project"
      };
    } else if (fs.existsSync(".bucket-config.json")) {
      context = {
        type: "bucket"
      };
    } else if (fs.existsSync(".transformation-config.json")) {
      context = {
        type: "transformation"
      };
    } else {
      this.error(
        "No bucket or transformation found in the current working directory."
      );
      return;
    }

    let configs: Array<BucketConfig> = await getTransformations();

    if (context.type === "bucket") {
      const storedBucketConfig = JSON.parse(
        fs.readFileSync(".bucket-config.json").toString()
      );

      configs = configs.filter(
        bucketConfig => bucketConfig.id === storedBucketConfig.id
      );
    }

    if (fs.existsSync(".transformation-config.json")) {
      const storedTransformationConfig = JSON.parse(
        fs.readFileSync(".transformation-config.json").toString()
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

    const writtenCount = store(configs, this, flags.configOnly);
    this.log(`\nPulled ${writtenCount} transformation(s).`);
  }
}
