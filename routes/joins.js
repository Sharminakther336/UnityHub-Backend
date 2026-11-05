
import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

const router = express.Router();

// Join an event
router.post("/", async (req, res) => {
  try {
    const db = getDB();

    const { eventId, userEmail } = req.body;

    if (!eventId || !userEmail) {
      return res.status(400).json({
        message: "Event ID and user email are required",
      });
    }

    if (!ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const event = await db.collection("events").findOne({
      _id: new ObjectId(eventId),
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const existingJoin = await db.collection("joins").findOne({
      eventId: new ObjectId(eventId),
      userEmail,
    });

    if (existingJoin) {
      return res.status(409).json({
        message: "You have already joined this event",
      });
    }

    const joinData = {
      eventId: new ObjectId(eventId),
      eventTitle: event.title,
      userEmail,
      joinedAt: new Date(),
    };

    await db.collection("joins").insertOne(joinData);

    res.status(201).json({
      message: "Event joined successfully",
    });
  } catch (error) {
    console.error("Join event error:", error);

    res.status(500).json({
      message: "Failed to join event",
    });
  }
});

// Get joined events by user email
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const userEmail = req.query.email;

    if (!userEmail) {
      return res.status(400).json({
        message: "User email is required",
      });
    }

    const joins = await db
      .collection("joins")
      .find({ userEmail })
      .sort({ joinedAt: -1 })
      .toArray();

    res.status(200).json(joins);
  } catch (error) {
    console.error("Fetch joined events error:", error);

    res.status(500).json({
      message: "Failed to fetch joined events",
    });
  }
});

export default router;
