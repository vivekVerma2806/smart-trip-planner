import express from "express";

const router = express.Router();

const geocodeCache = new Map();

router.get("/geocode", async (req, res) => {
  const place = req.query.place;

  if (!place) return res.json(null);

  if (geocodeCache.has(place)) {
    return res.json(geocodeCache.get(place));
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json`,
      {
        headers: { "User-Agent": "trip-planner" },
        signal: AbortSignal.timeout(5000)
      }
    );

    const data = await response.json();

    if (!data || data.length === 0) return res.json(null);

    const coords = {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };

    geocodeCache.set(place, coords);
    res.json(coords);

  } catch {
    res.json(null);
  }
});

export default router;