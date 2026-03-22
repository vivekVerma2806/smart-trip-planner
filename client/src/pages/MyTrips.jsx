import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import TripCard from "../components/TripCard";
import MapView from "../components/MapView";
import Comments from "../components/Comments";

export default function MyTrips() {
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [sharing, setSharing] = useState(false);

  const fetchTrips = async () => {
    try {
      const res = await axios.get("https://smart-trip-planner-8rdv.onrender.com/trips/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrips(res.data);
    } catch (err) {
      setError("Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTrips();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await axios.delete(`http://localhost:5000/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrips(trips.filter(t => t._id !== id));
      if (selectedTrip?._id === id) setSelectedTrip(null);
    } catch (err) {
      alert("Failed to delete trip");
    }
  };

  const handleShare = (id) => {
    const shareUrl = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(shareUrl);
    setSharing(true);
    setTimeout(() => setSharing(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Saved Journeys</h1>
        <p className="text-slate-500 font-medium text-lg">Your personal collection of AI-crafted adventures</p>
      </header>

      {trips.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">No saved trips yet</h2>
          <p className="text-slate-500 font-medium mb-8">Generate an itinerary and save it to see it here!</p>
          <a href="/" className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
            Start Planning
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-4">
            {trips.map((trip) => (
              <div 
                key={trip._id}
                onClick={() => setSelectedTrip(trip)}
                className={`p-6 bg-white rounded-3xl border transition-all cursor-pointer group ${
                  selectedTrip?._id === trip._id 
                    ? "border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/5" 
                    : "border-slate-100 hover:border-blue-200 hover:shadow-lg"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{trip.destination}</h3>
                    <div className="flex items-center gap-2 mb-1">
                       <p className="text-sm font-bold text-slate-400">{trip.days} Days • {trip.travelers} Travelers</p>
                       {trip.members?.length > 0 && (
                         <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black tracking-widest uppercase border border-blue-100">
                           {trip.members.length} Members
                         </span>
                       )}
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-blue-500"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7">
            {selectedTrip ? (
              <div className="animate-fade-in space-y-8">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Itinerary Details</h2>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleShare(selectedTrip._id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${sharing ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {sharing ? (
                         <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                          Copied!
                         </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                          Share Link
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => handleDelete(selectedTrip._id)}
                      className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl font-bold transition-all border border-rose-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-2 overflow-hidden">
                   <MapView places={selectedTrip.itinerary.flatMap(d => d.places).map(p => typeof p === 'object' ? p.name : p)} />
                </div>

                <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/80">
                   <h4 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter flex items-center gap-3">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                     The Adventure Crew
                   </h4>
                   <div className="flex flex-wrap gap-4">
                     {selectedTrip.members?.length === 0 ? (
                       <p className="text-slate-400 font-bold italic">No co-voyagers yet. Share your link to invite friends!</p>
                     ) : (
                       selectedTrip.members.map((member) => (
                         <div key={member._id} className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                           <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xs uppercase italic">
                             {member.name.charAt(0)}
                           </div>
                           <span className="font-bold text-slate-800">{member.name}</span>
                         </div>
                       ))
                     )}
                   </div>
                </div>

                <Comments 
                  tripId={selectedTrip._id} 
                  initialComments={selectedTrip.comments} 
                  isMember={true} 
                />

                <TripCard 
                  plan={selectedTrip.itinerary} 
                  tripId={selectedTrip._id}
                  metadata={selectedTrip}
                  onUpdate={(newItinerary) => {
                    const updated = { ...selectedTrip, itinerary: newItinerary };
                    setSelectedTrip(updated);
                    setTrips(trips.map(t => t._id === updated._id ? updated : t));
                  }}
                />
              </div>
            ) : (
              <div className="h-full bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center">
                <p className="text-slate-400 font-bold text-xl">Select a journey to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
