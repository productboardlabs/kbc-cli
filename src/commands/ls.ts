import { Command } from "@oclif/command";

import { getConfigs } from "../lib/keboolaHttpApi";

export default class List extends Command {
  static description = "list all transformations";

  async run() {
    // @ts-ignore
    const configs = await getConfigs();

    this.log("Transformation ID :: Bucket Name :: Tranformation Name");

    // @ts-ignore
    configs.forEach(bucketConfig => {
      // @ts-ignore
      bucketConfig.rows.forEach(transformation => {
        this.log(
          `${transformation.id} :: ${bucketConfig.name} :: ${
            transformation.name
          }`
        );
      });
    });
  }
}
