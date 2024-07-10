import { BuildOptions, build, stop } from "../deps/esbuild.ts";
import { fetchModules } from "../main/esbuild-fetch-modules-plugin.ts";

const file = "esbuild-fetch-modules-plugin";

export const options: BuildOptions = {
  bundle: true,
  platform: "neutral",
  entryPoints: [`src/main/${file}.ts`],
  plugins: [fetchModules],
};

if (import.meta.main) {
  await Promise.all([
    build({
      ...options,
      outfile: `tmp/${file}.js`,
    }),
    build({
      ...options,
      minify: true,
      sourcemap: true,
      outfile: `dist/${file}.js`,
    }),
  ]);

  await stop();
}
