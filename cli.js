#!/usr/bin/env node

const program = require("commander");
const commands = require("./commands");
var version = require("./package.json").version;

program.version(version);

program
  .command("pull")
  .description("pull all transformations from Keboola and store them locally")
  .option("-o, --outDir <path>", "default is the current working directory")
  .option("-f, --force", "force to overwrite local files")
  .action(options => {
    commands.pull(options.outDir).catch(error => console.error(error));
  });

program
  .command("push")
  .description("push transformation to Keboola")
  .option("-p, --path <path>", "path to transformation")
  .option("-v, --verbose")
  .action(options => {
    commands
      .push(options.path)
      .then(response => options.verbose && console.log(response))
      .catch(error => console.error(error));
  });

program
  .command("inputs <ls|add|refresh|remove>")
  .description("manage input mappings")
  .option("-p, --path <path>", "path to transformation")
  .option(
    "-c, --columns [column names...]",
    "Space separated list of column names"
  )
  .action(options => {
    console.log(options.path);
  });

program
  .command("outputs <ls|add|remove>")
  .description("manage output mappings")
  .option("-p, --path <path>", "path to transformation")
  .action(options => {
    console.log(options.path);
  });

program.parse(process.argv);

if (!program.args.length) {
  program.help();
  process.exit();
}

if (process.env["KEBOOLA_TOKEN"] === undefined) {
  console.error("$KEBOOLA_TOKEN environment variable is not set");
  process.exit(1);
}
