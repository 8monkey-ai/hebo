#!/usr/bin/env bun
import plugin from "bun-plugin-tailwind";

await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  plugins: [plugin],
  minify: true,
  target: "bun",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
