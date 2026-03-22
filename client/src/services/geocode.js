export const getCoordinates = async (place) => {
  try {
    const res = await fetch(
      `http://localhost:5000/geocode?place=${encodeURIComponent(place)}`
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (err) {
    console.log("Geocode error:", err);
    return null;
  }
};