
import express from "express";
import { getDB } from "../db.js";
import { sampleEvents } from "../data/sampleEvents.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const db = getDB();

    // Prevent duplicate sample events
    const existingEvents = await db
      .collection("events")
      .countDocuments({
        creatorEmail: "admin@unityhub.com",
      });

    if (existingEvents > 0) {
      return res.status(409).json({
        message: "Sample events already exist",
      });
    }

    const result = await db
      .collection("events")
      .insertMany(sampleEvents);

    res.status(201).json({
      message: "6 sample events inserted successfully",
      insertedCount: result.insertedCount,
    });
  } catch (error) {
    console.error("Seed error:", error);

    res.status(500).json({
      message: "Failed to insert sample events",
    });
  }
});

export default router;
