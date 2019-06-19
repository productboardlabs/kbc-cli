import { Hook } from "@oclif/config";

const hook: Hook<"init"> = async opts => {
  if (process.env["KEBOOLA_TOKEN"] === undefined) {
    console.error("$KEBOOLA_TOKEN environment variable is not set");
    process.exit(1);
  }
};

export default hook;
