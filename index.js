const program = require("commander");
const commands = require("./commands");

program.version("0.0.1");

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
  .action(options => {
    console.log(options.path);
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
