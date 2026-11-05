
import "dotenv/config";
import dns from "node:dns";
import { MongoClient } from "mongodb";

// DNS configuration
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env");
}

const client = new MongoClient(uri);

let database;

// Connect MongoDB
export async function connectDB() {
  try {
    await client.connect();

    database = client.db();

    await database.command({ ping: 1 });

    console.log("MongoDB Connected Successfully!");

    return database;
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    throw error;
  }
}

// Get Database
export function getDB() {
  if (!database) {
    throw new Error("Database is not connected yet.");
  }

  return database;
}
