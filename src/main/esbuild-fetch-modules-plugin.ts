import { Loader, Plugin } from "../deps/esbuild.ts";

export const NAMESPACE = "fetch-modules";

export const fetchModules: Plugin = {
  name: NAMESPACE,
  setup(build) {
    build.onResolve({ filter: /^http.*(?:css|json|[jt]sx?)$/ }, ({ path }) => ({
      path,
      namespace: NAMESPACE,
    }));

    build.onResolve(
      {
        filter: /^[.]/,
        namespace: NAMESPACE,
      },
      ({ path, importer }) => ({
        path: new URL(path, importer).href,
        namespace: NAMESPACE,
      }),
    );

    build.onLoad(
      {
        filter: /./,
        namespace: NAMESPACE,
      },
      async ({ path }) => ({
        contents: await (await fetch(path)).text(),
        loader: path.slice(path.lastIndexOf(".") + 1) as Loader,
      }),
    );
  },
};
