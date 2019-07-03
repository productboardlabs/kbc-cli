import * as fs from "fs";

export interface Context {
  type: "project" | "transformations" | "bucket" | "transformation";
  rootPath: string;
  configFile: string;
}

export default () => {
  const availableContexts: Array<Context> = [
    {
      type: "project",
      rootPath: ".",
      configFile: ".kbc-cli"
    },
    {
      type: "transformations",
      rootPath: "..",
      configFile: "../.kbc-cli"
    },
    {
      type: "bucket",
      rootPath: "../..",
      configFile: ".bucket-config.json"
    },
    {
      type: "transformation",
      rootPath: "../../..",
      configFile: ".transformation-config.json"
    }
  ];

  for (let contex of availableContexts) {
    if (fs.existsSync(contex.configFile)) {
      return contex;
    }
  }

  throw new Error("Command called outside of the project directory");
};
