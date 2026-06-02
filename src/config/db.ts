// backend/src/config/db.ts
import mongoose from "mongoose";
import { env } from "./env";

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 3000;

async function connectWithRetry(attempt = 1): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error(`MongoDB connection attempt ${attempt} failed`, error);
    if (attempt < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_INTERVAL_MS / 1000}s...`);
      await new Promise((res) => setTimeout(res, RETRY_INTERVAL_MS));
      return connectWithRetry(attempt + 1);
    }
    console.error("❌ MongoDB connection failed after max retries");
    process.exit(1);
  }
}

export default connectWithRetry;
