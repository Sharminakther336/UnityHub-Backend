
import express from "express";
import { getDB } from "../db.js";

const router = express.Router();

// Get upcoming events
router.get("/", async (req, res) => {
  try {
    const db = getDB();

    const limit = Number(req.query.limit);

    let query = db.collection("events").find({
      date: { $gte: new Date() },
    }).sort({ date: 1 });

    if (Number.isInteger(limit) && limit > 0) {
      query = query.limit(limit);
    }

    const events = await query.toArray();

    res.status(200).json(events);
  } catch (error) {
    console.error("Fetch events error:", error);
    res.status(500).json({
      message: "Failed to fetch events",
    });
  }
});

// Get event statistics
router.get("/stats", async (req, res) => {
  try {
    const db = getDB();

    const [totalEvents, activeMembers, volunteers, communities] =
      await Promise.all([
        db.collection("events").countDocuments(),
        db.collection("users").countDocuments(),
        db.collection("volunteers").countDocuments(),
        db.collection("communities").countDocuments(),
      ]);

    res.status(200).json({
      totalEvents,
      activeMembers,
      volunteers,
      communities,
    });
  } catch (error) {
    console.error("Statistics error:", error);
    res.status(500).json({
      message: "Failed to fetch statistics",
    });
  }
});

// Create event
router.post("/", async (req, res) => {
  try {
    const db = getDB();

    const {
      title,
      description,
      eventType,
      thumbnail,
      location,
      date,
      creatorEmail,
    } = req.body;

    if (
      !title ||
      !description ||
      !eventType ||
      !thumbnail ||
      !location ||
      !date ||
      !creatorEmail
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const eventDate = new Date(date);

    if (Number.isNaN(eventDate.getTime()) || eventDate <= new Date()) {
      return res.status(400).json({
        message: "Event date must be in the future",
      });
    }

    const newEvent = {
      title,
      description,
      eventType,
      thumbnail,
      location,
      date: eventDate,
      creatorEmail,
      createdAt: new Date(),
    };

    const result = await db.collection("events").insertOne(newEvent);

    res.status(201).json({
      message: "Event created successfully",
      eventId: result.insertedId,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({
      message: "Failed to create event",
    });
  }
});

export default router;
