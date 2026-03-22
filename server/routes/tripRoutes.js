import express from "express";
import Trip from "../models/Trip.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();


// ✅ SAVE TRIP
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { destination, days, budget, travelers, itinerary } = req.body;

    if (!itinerary || itinerary.length === 0) {
      return res.status(400).json({ error: "No itinerary" });
    }

    const trip = await Trip.create({
      userId: req.userId,
      destination,
      days,
      budget,
      travelers,
      itinerary
    });

    res.json({ message: "Trip saved", trip });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET MY TRIPS (Populate members & comments)
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ 
      $or: [{ userId: req.userId }, { members: req.userId }] 
    })
    .populate("members", "name email")
    .populate("comments.userId", "name")
    .sort({ createdAt: -1 });

    res.json(trips);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ DELETE TRIP
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json({ message: "Trip deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET PUBLIC TRIP (For Sharing)
router.get("/public/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("members", "name email")
      .populate("userId", "name")
      .populate("comments.userId", "name");
      
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ JOIN TRIP
router.post("/join/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    if (trip.userId.toString() === req.userId) {
      return res.status(400).json({ error: "You are the owner of this trip" });
    }

    if (trip.members.includes(req.userId)) {
      return res.status(400).json({ error: "You have already joined this trip" });
    }

    trip.members.push(req.userId);
    await trip.save();
    res.json({ message: "Joined successfully", trip });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADD COMMENT (Members Only)
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    // Check if user is owner or member
    const isOwner = trip.userId.toString() === req.userId;
    const isMember = trip.members.includes(req.userId);

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: "Only trip members can join the discussion" });
    }

    trip.comments.push({ userId: req.userId, text });
    await trip.save();

    const updatedTrip = await Trip.findById(req.params.id).populate("comments.userId", "name");
    res.json(updatedTrip.comments);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;