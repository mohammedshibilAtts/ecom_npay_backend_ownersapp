import "dotenv/config";

const config = {
  mongodb: {
    url: process.env.MONGO_URI,
    databaseName: process.env.DB_NAME
  },
  migrationsDir: "src/infrastructure/database/migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "esm",
};

export default config;