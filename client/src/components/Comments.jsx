import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Comments({ tripId, initialComments = [], isMember }) {
  const { token, user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !token) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/trips/${tripId}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data);
      setNewComment("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/80 shadow-xl shadow-slate-200/20">
      <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Discussion Board
      </h3>

      <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
        {comments.length === 0 ? (
          <div className="text-center py-10 opacity-50">
            <p className="font-bold text-slate-400 italic">No thoughts shared yet.</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div key={index} className="group animate-fade-in-up">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs uppercase italic flex-shrink-0 shadow-lg shadow-slate-900/10">
                  {comment.userId?.name?.charAt(0) || "V"}
                </div>
                <div className="flex-grow">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="font-black text-slate-900 border-b-2 border-transparent group-hover:border-blue-500/30 transition-all">{comment.userId?.name}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                    <p className="text-slate-600 font-medium leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isMember ? (
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            required
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your suggestion..."
            className="w-full pl-6 pr-16 py-5 bg-white border border-slate-200 rounded-3xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-slate-300"
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="absolute right-3 top-3 bottom-3 px-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 disabled:opacity-30 transition-all flex items-center justify-center"
          >
            {loading ? "..." : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>}
          </button>
        </form>
      ) : (
        <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-center">
           <p className="text-slate-400 font-bold text-sm italic">Only trip members can join the discussion.</p>
        </div>
      )}
    </div>
  );
}
