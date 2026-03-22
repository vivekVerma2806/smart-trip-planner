import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

router.post("/plan-trip", async (req, res) => {
  const { destination, budget, days, travelers } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API Key is missing in server environment." });
  }

  // Initialize inside route to ensure process.env is latest
  const genAI = new GoogleGenerativeAI(apiKey);

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
      model: "gemini-1.5-flash", 
    });

    const prompt = `You are a STRICT JSON itinerary generator. You MUST follow ALL rules.

// ==================== RULES ====================
// 1. Generate EXACTLY ${days} days (Day 1 to Day ${days}).
// 2. Each day MUST have 3 to 5 UNIQUE, REAL, SPECIFIC places.
// 3. NEVER output only a city name like "Goa".
// 4. Each place MUST be a real tourist location (beach, temple, fort, museum, etc.).
// 5. Each place MUST include location context:
//    Example: "Baga Beach, Goa"
// 6. DO NOT repeat ANY place across days.
// 7. DO NOT use generic phrases (e.g., explore city, visit nearby places, local attractions).
// 8. If you cannot find enough places: REDUCE places per day BUT still generate ALL ${days} days.
// 9. Output MUST be VALID JSON ONLY. No explanation. No extra text.

// ==================== FORMAT ====================
// {
//   "itinerary": [
//     {
//       "day": "Day 1",
//       "description": "Short summary of the day's theme (e.g., Coastal exploration and sunset views).",
//       "places": [
//         { "name": "Baga Beach, Goa", "details": "Mandatory: 15-20 words describing why this place is worth visiting." },
//         { "name": "Fort Aguada, Goa", "details": "Mandatory: Historical context or unique features." }
//       ]
//     }
//   ]
// }

// ==================== VALIDATION ====================
// - Ensure total days = ${days}
// - Ensure every day has a 'description'
// - Ensure every place has rich 'details' (crucial for user engagement)
// - Ensure NO place is just a city name
// - Ensure NO duplicates
// - Ensure each place contains a comma (location context)
// - Ensure valid JSON

// Destination: ${destination}
// Days: ${days}
// Budget: ${budget}
// Travelers: ${travelers || 1}

// Generate now.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI returned invalid JSON format");
    
    const parsed = JSON.parse(jsonMatch[0]);

    return res.json({
      destination,
      plan: parsed.itinerary || parsed
    });

  } catch (err) {
    console.error("Gemini Error:", err);
    return res.json({
      destination,
      plan: fallbackPlan,
      error: err.message,
      tip: "If you see 'API_KEY_INVALID', please double-check your .env file."
    });
  }
});

export default router;