import { isProd } from "./env";

const heboWww = new sst.aws.StaticSite("HeboWww", {
  path: "apps/www",
  build: {
    command: "bun run build",
    output: "build/client",
  },
  domain: isProd ? "hebo.ai" : `${$app.stage}.hebo.ai`,
});

export default heboWww;
