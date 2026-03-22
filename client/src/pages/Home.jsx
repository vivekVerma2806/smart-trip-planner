import { useState } from "react";
import Form from "../components/Form";
import TripCard from "../components/TripCard";
import { getTripPlan } from "../services/api";
import MapView from "../components/MapView";

export default function Home() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestData, setRequestData] = useState(null);
  

  const handleSubmit = async (data) => {
    // 🧠 RULE: NO DUPLICATE CALLS
    // If the input is exactly the same as the last successful generation, just reuse it!
    if (plan && JSON.stringify(data) === JSON.stringify(requestData)) {
      console.log("REUSING EXISTING PLAN (Input identical)");
      return; 
    }

    setLoading(true);
    setError(null);
    setRequestData(data);

    try {
      const res = await getTripPlan(data);
      // getTripPlan now returns the whole object so we can check for errors
      if (res.error || res.debugError) {
        setError(res.error || res.debugError);
        // If there's an error, don't set a plan that might be an error object itself
        if (res.plan && Array.isArray(res.plan)) {
          setPlan(res.plan);
        } else if (Array.isArray(res)) {
          setPlan(res);
        } else {
          setPlan(null);
        }
      } else {
        setPlan(res.plan || res);
      }
    } catch (err) {
      console.log("Error:", err);
      setError(err.message);
    }

    setLoading(false);
  };

  const handleClear = () => {
    setPlan(null);
    setError(null);
  };

  // 🔥 PURE JSON DATA PIPELINE
  const getCleanPlaces = () => {
    if (!plan || !Array.isArray(plan)) return [];

    return plan
      .flatMap((day) => day.places)
      .filter(Boolean)
      .map((place) => (typeof place === "object" ? place.name : place)); // handle both new {name} objects and old string formats
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-200 overflow-x-hidden relative">
      {/* Background Blobs for Glassmorphism Effect */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-72 h-72 md:w-96 md:h-96 rounded-full bg-blue-300 opacity-30 blur-[80px] animate-blob"></div>
        <div className="absolute top-[-10%] right-[-5%] w-72 h-72 md:w-96 md:h-96 rounded-full bg-purple-300 opacity-30 blur-[80px] animate-blob [animation-delay:2s]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-72 h-72 md:w-96 md:h-96 rounded-full bg-indigo-300 opacity-30 blur-[80px] animate-blob [animation-delay:4s]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center p-6 md:p-12 w-full max-w-6xl mx-auto min-h-screen">
        
        <header className="mb-12 mt-8 lg:mb-16 text-center animate-fade-in-down w-full px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-bold tracking-widest text-blue-600 uppercase bg-blue-50/50 backdrop-blur-sm rounded-full border border-blue-100/50 shadow-sm animate-pulse-slow">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            AI-Powered Travel Intelligence
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
            Your Next <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 drop-shadow-sm">Journey</span>, <br className="hidden md:block" /> Perfected.
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
            Stop planning, start exploring. Let our advanced AI craft a bespoke itinerary tailored to your unique rhythm.
          </p>
        </header>

        <main className="w-full flex flex-col items-center flex-grow">
          {error && (
            <div className="w-full max-w-3xl mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-medium animate-fade-in-down flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-rose-100 text-rose-500 font-bold">!</span>
              <p><b>AI Error:</b> {error}. Showing fallback plan instead.</p>
            </div>
          )}
          <Form onSubmit={handleSubmit} loading={loading} />

          {loading && (
            <div className="mt-16 flex flex-col items-center justify-center animate-fade-in">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-8 border-blue-50 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <svg className="w-8 h-8 text-blue-600 animate-bounce" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                   </svg>
                </div>
              </div>
              <div className="space-y-2 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Designing your adventure...</p>
                <p className="text-slate-400 font-medium animate-pulse">Consulting global travel routes & local insights</p>
              </div>
            </div>
          )}

          {plan && !loading && (
            <div className="w-full mt-10 animate-fade-in-up pb-12">
              <div className="flex flex-col lg:flex-row gap-10 items-start w-full">
                
                {/* Itinerary Column */}
                <div className="w-full lg:w-1/2">
                  <div className="mb-6 flex items-center justify-between pl-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800">Your Journey</h2>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleClear}
                        className="text-sm font-semibold px-4 py-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        Reset
                      </button>
                      <span className="text-sm font-semibold px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full shadow-sm border border-indigo-100">
                        Itinerary Generated ✨
                      </span>
                    </div>
                  </div>
                  <TripCard plan={plan} metadata={requestData} />
                </div>

                {/* Map Column */}
                <div className="w-full lg:w-1/2 lg:sticky lg:top-8">
                  <div className="mb-6 pl-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800">Destinations Map</h2>
                  </div>
                  <div className="p-2 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-blue-900/10 transition-all duration-300 hover:shadow-blue-900/20">
                    <MapView places={getCleanPlaces()} />
                  </div>
                </div>

              </div>
            </div>
          )}
        </main>

      </div>
      
      <footer className="relative z-10 w-full py-12 border-t border-slate-200/30 text-center">
        <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-300">
          Crafted with ❤️ by <span className="text-slate-900 border-b-2 border-blue-500/20">Vivek Kumar Verma</span>
        </p>
      </footer>
    </div>
  );
}