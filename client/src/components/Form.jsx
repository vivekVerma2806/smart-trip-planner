import { useState } from "react";

export default function Form({ onSubmit, loading }) {
  const [form, setForm] = useState({
    destination: "",
    budget: "",
    days: "",
    travelers: "1"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-white/60 w-full max-w-3xl mt-8 mb-4 relative overflow-hidden group">
      {/* Decorative gradient orb inside the form */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 transition-opacity duration-700 group-hover:opacity-70 pointer-events-none"></div>

      <div className="mb-8 relative z-10 text-center md:text-left">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Where to next?</h2>
        <p className="text-slate-500 text-base">Fill in your preferences, and we'll handle the logistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
        <div className="md:col-span-2 group/field">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2.5 ml-2 tracking-wide uppercase text-xs group-focus-within/field:text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="m20 16-4 4-4-4"/><path d="m4 8 4-4 4 4"/><path d="M16 20V4"/><path d="M8 4v16"/></svg>
            Destination
          </label>
          <div className="relative overflow-hidden rounded-2xl">
            <input
              name="destination"
              placeholder="e.g. Kyoto, Japan or Paris, France"
              onChange={handleChange}
              className="w-full p-4 pl-12 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 placeholder:text-slate-400 text-slate-800 shadow-sm font-medium"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        </div>

        <div className="group/field">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2.5 ml-2 tracking-wide uppercase text-xs group-focus-within/field:text-blue-600 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             Total Budget
          </label>
          <div className="relative overflow-hidden rounded-2xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg group-focus-within/field:text-indigo-500 transition-colors">₹</span>
            <input
              name="budget"
              placeholder="e.g. 50000"
              onChange={handleChange}
              className="w-full p-4 pl-10 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 placeholder:text-slate-400 text-slate-800 shadow-sm font-medium"
            />
          </div>
        </div>

        <div className="group/field">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2.5 ml-2 tracking-wide uppercase text-xs group-focus-within/field:text-blue-600 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
             Duration (Days)
          </label>
          <div className="relative overflow-hidden rounded-2xl">
            <input
              name="days"
              type="number"
              min="1"
              placeholder="e.g. 5"
              onChange={handleChange}
              className="w-full p-4 pl-12 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 placeholder:text-slate-400 text-slate-800 shadow-sm font-medium"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-purple-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 group/field">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2.5 ml-2 tracking-wide uppercase text-xs group-focus-within/field:text-blue-600 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
             Number of Travelers
          </label>
          <div className="relative overflow-hidden rounded-2xl">
            <input
              name="travelers"
              type="number"
              min="1"
              placeholder="e.g. 2"
              onChange={handleChange}
              className="w-full p-4 pl-12 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 placeholder:text-slate-400 text-slate-800 shadow-sm font-medium"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-pink-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSubmit(form)}
        disabled={loading}
        className="relative z-10 w-full overflow-hidden bg-slate-900 text-white py-4.5 rounded-[1.5rem] font-black text-xl hover:bg-black transition-all duration-500 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0 group/btn"
      >
        <div className="relative z-20 flex items-center justify-center gap-3">
          {loading ? (
            <>
               <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
               Calculating Possibilities...
            </>
          ) : (
            <>
              Explore New Horizons
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1.5 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 z-10"></div>
      </button>

    </div>
  );
}