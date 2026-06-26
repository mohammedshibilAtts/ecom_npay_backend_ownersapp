import mongoose from "mongoose";
import config from "../../../config/chit/env.js";
import ProductRepository from "./productRepository.js";

const run = async () => {
  try {
    await mongoose.connect(config.DB_URI);
    console.log("Connected to MongoDB.");

    const repo = new ProductRepository();
    await repo.syncProductStaticFields();

    console.log("Sync complete.");
    process.exit(0);
  } catch (error) {
    console.error("Failed:", error);
    process.exit(1);
  }
};

run();
