import { expect, test } from "@oclif/test";
import * as nock from "nock";
import * as fs from "fs";
import * as rimraf from "rimraf";

import configs from "../fixtures/configs";

describe("pull", () => {
  beforeEach(() => {
    nock("https://connection.keboola.com")
      .get("/v2/storage/components/transformation/configs")
      .reply(200, configs);
  });

  // https://github.com/oclif/oclif/issues/142
  // test
  //   .stderr()
  //   .command(["pull"])
  //   .it("runs pull without arguments", ctx => {
  //     expect(ctx.stderr).to.contain("id not provided");
  //   });

  test
    .stdout()
    .command(["pull", `--all`])
    .it("runs pull with --all flag", ctx => {
      expect(ctx.stdout).to.contain(
        `${configs.length} transformation(s) written to`
      );
      expect(fs.existsSync(`${configs[0].name}/test/queries.sql`)).to.be.true;
      expect(fs.existsSync(`${configs[0].name}/test/.config`)).to.be.true;
    });

  test
    .stdout()
    .command(["pull", `${configs[0].rows[0].id}`])
    .it("runs pull with transformation id", ctx => {
      expect(ctx.stdout).to.contain(`1 transformation(s) written to`);
      expect(fs.existsSync(`${configs[0].name}/test/queries.sql`)).to.be.true;
      expect(fs.existsSync(`${configs[0].name}/test/.config`)).to.be.true;
    });

  const outDir = "test-transformations";

  test
    .stdout()
    .command(["pull", `--outDir=${outDir}`, `--all`])
    .it("runs pull with custom --outDir", ctx => {
      process.chdir("../");
      expect(fs.existsSync(`${outDir}`)).to.be.true;
    });

  after(() => {
    rimraf.sync(`${outDir}`);
    configs.forEach(config => rimraf.sync(config.name));
  });
});
