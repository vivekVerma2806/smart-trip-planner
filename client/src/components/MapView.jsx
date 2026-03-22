import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { getCoordinates } from "../services/geocode";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function MapView({ places }) {
  const [coords, setCoords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoords = async () => {
      if (!places || places.length === 0) return;

      setLoading(true);
      try {
        const validPlaces = places.filter(place => {
          if (!place || typeof place !== 'string') return false;
          const lower = place.toLowerCase();
          return !lower.includes('ai error') && !lower.includes('fallback');
        });

        const results = await Promise.all(
          validPlaces.map((place) => getCoordinates(place))
        );

        const valid = results
          .map((res, i) => res && { ...res, name: validPlaces[i] })
          .filter(Boolean);

        setCoords(valid);
      } catch (err) {
        console.log("Map error:", err);
      }
      setLoading(false);
    };

    fetchCoords();
  }, [places]);

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-slate-100/50 backdrop-blur-sm rounded-[2rem] flex flex-col items-center justify-center border border-slate-200 shadow-inner mt-2">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-medium">Pinpointing map locations...</p>
      </div>
    );
  }

  if (coords.length === 0) {
    return (
      <div className="w-full h-[300px] bg-rose-50 rounded-[2rem] flex items-center justify-center border border-rose-100 mt-2 px-6 text-center">
        <p className="text-rose-600 font-medium">
          Unable to load map locations. (Geocoding API may be unavailable or places not found)
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-4 relative rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-blue-900/10 border border-white/80 transition-all duration-500 hover:shadow-blue-900/20">
      <div className="absolute inset-0 pointer-events-none border-[8px] border-white/10 rounded-[2.5rem] z-[1000]"></div>
      <MapContainer
        key={`${coords[0].lat}-${coords[0].lon}`}
        center={[coords[0].lat, coords[0].lon]}
        zoom={12}
        style={{ height: "650px", width: "100%", zIndex: 10 }}
        className="rounded-[2.5rem] bg-slate-50"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {coords.map((place, index) => (
          <Marker key={index} position={[place.lat, place.lon]}>
             <Popup className="rounded-2xl overflow-hidden font-sans">
               <div className="p-3">
                 <div className="font-black text-slate-900 text-lg mb-1">{place.name}</div>
                 <div className="text-blue-600 text-xs font-bold uppercase tracking-widest leading-relaxed">Destination {index + 1}</div>
               </div>
             </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}