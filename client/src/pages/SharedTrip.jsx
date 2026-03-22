import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import TripCard from "../components/TripCard";
import MapView from "../components/MapView";
import Comments from "../components/Comments";

export default function SharedTrip() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedTrip = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/trips/public/${id}`);
        setTrip(res.data);
      } catch (err) {
        setError("This itinerary could not be found or is no longer shared.");
      } finally {
        setLoading(false);
      }
    };
    fetchSharedTrip();
  }, [id]);

  const handleJoin = async () => {
    if (!token) return;
    setJoining(true);
    try {
      await axios.post(`http://localhost:5000/trips/join/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh trip data
      const res = await axios.get(`http://localhost:5000/trips/public/${id}`);
      setTrip(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to join trip");
    } finally {
      setJoining(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSharing(true);
    setTimeout(() => setSharing(false), 2000);
  };

  const isMember = trip?.members?.some(m => m._id === user?.id);
  const isOwner = trip?.userId?._id === user?.id;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-2">Trip Not Found</h2>
      <p className="text-slate-500 font-medium mb-8 max-w-md">{error}</p>
      <Link to="/" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg">Go Back Home</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 animate-fade-in">
      <header className="mb-12 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-xs font-black tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full border border-blue-100">
            Shared Itinerary ✨
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">{trip.destination}</h1>
          <p className="mt-4 text-xl text-slate-500 font-bold">{trip.days} Day Masterpiece • Created by {trip.userId?.name || 'Explorer'}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
             onClick={handleShare}
             className={`w-full sm:w-auto px-8 py-5 rounded-[2rem] font-black text-lg transition-all shadow-xl ${sharing ? 'bg-green-500 text-white' : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50'}`}
          >
            {sharing ? "Link Copied! ✅" : "Share with Friends 🔗"}
          </button>

          {user && !isOwner && !isMember && (
            <button 
              onClick={handleJoin}
              disabled={joining}
              className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              {joining ? "Joining..." : "Join this Adventure 🎒"}
            </button>
          )}
          
          <Link to="/" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 group px-8 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all">
            Build My Own
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
        <div className="space-y-8">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-2xl font-bold border border-slate-200">
              {trip.members?.length || 0} Co-Voyagers
            </span>
            {isMember && (
               <span className="px-4 py-2 bg-green-100 text-green-700 rounded-2xl font-bold border border-green-200">
                You're Joined ✅
               </span>
            )}
          </div>
          <div className="p-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
             <MapView places={trip.itinerary.flatMap(d => d.places).map(p => typeof p === 'object' ? p.name : p)} />
          </div>
        </div>
        <div className="space-y-6">
          <Comments 
            tripId={id} 
            initialComments={trip.comments} 
            isMember={isMember || isOwner} 
          />
          <TripCard 
            plan={trip.itinerary} 
            tripId={id}
            metadata={trip}
            onUpdate={(newItinerary) => setTrip({ ...trip, itinerary: newItinerary })}
          />
        </div>
      </div>
    </div>
  );
}
