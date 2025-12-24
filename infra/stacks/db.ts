import { isProd } from "./env";
import heboVpc from "./network";

const globalCluster = new aws.rds.GlobalCluster("HeboDbGlobal", {
  globalClusterIdentifier: `${$app.stage}-hebo-db-global`,
  engine: "aurora-postgresql",
  engineVersion: "17.6",
  storageEncrypted: true,
});

const heboDatabase = new sst.aws.Aurora("HeboDatabase", {
  engine: "postgres",
  version: "17.6",
  vpc: heboVpc,
  replicas: isProd ? 1 : 0,
  scaling: isProd
    ? { min: "0.5 ACU" }
    : { min: "0 ACU", max: "4 ACU", pauseAfter: "20 minutes" },
  database: "hebo",
  transform: {
    cluster: (a) => {
      a.globalClusterIdentifier = globalCluster.id;
    },
  },
});

export default heboDatabase;
