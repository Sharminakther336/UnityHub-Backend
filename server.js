import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./db.js";
import eventsRouter from "./routes/events.js";
import seedRouter from "./routes/seed.js";
import joinsRouter from "./routes/joins.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://unity-hub-assignment-8.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("UnityHub Server is running!");
});

app.use("/api/events", eventsRouter);
app.use("/api/seed", seedRouter);
app.use("/api/joins", joinsRouter);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`UnityHub Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
