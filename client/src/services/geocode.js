export const getCoordinates = async (place) => {
  try {
    const res = await fetch(
      `https://smart-trip-planner-8rdv.onrender.com/geocode?place=${encodeURIComponent(place)}`
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (err) {
    console.log("Geocode error:", err);
    return null;
  }
};
