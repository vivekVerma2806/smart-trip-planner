import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
            <span className="text-white text-xl font-black italic">A</span>
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tighter">AI-Travel</span>
          <div className="hidden sm:flex items-center ml-2 pl-4 border-l border-slate-200">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">by Vivek Kumar Verma</span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/my-trips" className="text-slate-600 font-bold hover:text-slate-900 transition-colors">My Trips</Link>
              <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-900 leading-tight">{user.name}</p>
                  <p className="text-xs font-bold text-slate-400">Voyager</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold transition-all"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-5 py-2.5 text-slate-600 font-bold hover:text-slate-900 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
