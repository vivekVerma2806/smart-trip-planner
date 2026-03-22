import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import tripRoutes from "./routes/tripRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/trips", tripRoutes);

// ✅ DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err.message));

// ✅ Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend working");
});

// ✅ Plan Trip Route (Matching user's working reference)
app.post("/plan-trip", async (req, res) => {
  const { destination, budget, days, travelers } = req.body;

  if (!destination || !budget || !days) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // 🧠 RULE: DEV TIME AI OFF
  if (process.env.DEV_MODE === "true") {
    console.log("🛠️ DEV MODE ACTIVE: Returning static fallback to save quota.");
    const devFallback = [
      {
        day: "Day 1",
        description: `Arriving in ${destination} and exploring the city center.`,
        places: [
          { name: "Central Park", details: "Enjoy a peaceful walk in the heart of the city." },
          { name: "Main Square", details: "Visit the historical landmarks and local cafes." }
        ]
      },
      {
        day: "Day 2",
        description: "Deep dive into local culture and cuisine.",
        places: [
          { name: "City Museum", details: "Explore the rich history and art of the region." },
          { name: "Famous Local Bistro", details: "Taste the most popular local dishes." }
        ]
      },
      {
        day: "Day 3",
        description: "Relaxing day and scenic views.",
        places: [
          { name: "Sunset Viewpoint", details: "Catch the best panoramic view of the destination." },
          { name: "Souvenir Market", details: "Pick up some local crafts and gifts." }
        ]
      }
    ];
    return res.json({ destination, plan: devFallback });
  }

  const fallbackPlan = Array.from({ length: parseInt(days) || 2 }, (_, i) => ({
    day: `Day ${i + 1}`,
    description: "Fallback plan due to AI error.",
    places: [
      {
        name: i === 0 ? "⚠️ AI ERROR" : destination,
        details: "Please check your API key in the .env file.",
      },
    ],
  }));

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-flash-latest", // Use the user's specific model string
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are a STRICT JSON itinerary generator for ${destination}. 
    Days: ${days}, Budget: ${budget}, Travelers: ${travelers || 1}.
    
    Rules:
    1. Generate EXACTLY ${days} days.
    2. Each day MUST have a 'description' summary.
    3. Each place MUST have name and 'details'.
    4. Format: {"itinerary": [{"day": "Day 1", "description": "...", "places": [{"name": "...", "details": "..."}]}]}
    
    Generate valid JSON now.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response");
    
    const parsedData = JSON.parse(jsonMatch[0]);
    let finalPlan = parsedData.itinerary || parsedData;

    // Safety extraction logic from user's code
    if (Array.isArray(finalPlan) && finalPlan.length === 1 && finalPlan[0].itinerary) {
      finalPlan = finalPlan[0].itinerary;
    }

    res.json({ destination, plan: finalPlan });

  } catch (error) {
    console.log("❌ Gemini Error:", error.message);
    res.json({ 
      destination, 
      plan: fallbackPlan, 
      error: error.message 
    });
  }
});

// ✅ Geocode Route (Matching user's working reference)
const geocodeCache = new Map();
app.get("/geocode", async (req, res) => {
  const place = req.query.place;
  if (!place) return res.json(null);
  
  if (geocodeCache.has(place)) return res.json(geocodeCache.get(place));

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json`,
      {
        headers: { "User-Agent": "trip-planner-app-by-vivek@local" },
        timeout: 5000
      }
    );
    const data = response.data;
    if (!data || data.length === 0) return res.json(null);

    const coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    geocodeCache.set(place, coords);
    res.json(coords);
  } catch (err) {
    res.json(null);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
