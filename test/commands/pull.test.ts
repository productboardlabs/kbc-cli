import { expect, test } from "@oclif/test";
import * as nock from "nock";
import * as fs from "fs";

import configs from "../fixtures/configs";

const outDir = "test-transformations";

describe("pull", () => {
  beforeEach(() => {
    nock("https://connection.keboola.com")
      .get("/v2/storage/components/transformation/configs")
      .reply(200, configs);
  });

  test
    .stdout()
    .command(["pull", `--outDir=${outDir}`])
    .it("runs pull", ctx => {
      expect(ctx.stdout).to.contain(
        `${configs.length} transformations written to ${outDir}`
      );

      expect(fs.existsSync(`test/test/queries.sql`)).to.be.true;
      expect(fs.existsSync(`test/test/.config`)).to.be.true;
    });
});
