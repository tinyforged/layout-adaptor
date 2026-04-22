import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    esbuild: {
      minify: true,
    },
    resolve: {
      vue: "vue",
    },
  },
  externals: ["vue", "@tinyforged/layout-adaptor"],
});
