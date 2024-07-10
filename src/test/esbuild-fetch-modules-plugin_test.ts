import { assert } from "../deps/assert.ts";
import { build, stop } from "../deps/esbuild.ts";
import { fetchModules } from "../main/esbuild-fetch-modules-plugin.ts";

const { test, readTextFile } = Deno;

test("fetch imported remote module", async () => {
  await build({
    bundle: true,
    platform: "neutral",
    outdir: "src/test/dist",
    plugins: [fetchModules],
    entryPoints: ["src/test/root.ts"],
  });

  await stop();

  const source = await readTextFile("src/test/root.ts");
  const target = await readTextFile("src/test/dist/root.js");

  assert(
    source.includes("parent") && !source.includes("child"),
    "invalid source file",
  );
  assert(
    target.includes("parent") && target.includes("child"),
    "invalid target file",
  );
});
