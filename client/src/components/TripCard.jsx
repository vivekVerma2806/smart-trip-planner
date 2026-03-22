import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function TripCard({ plan, metadata, tripId, onUpdate }) {
  const { token, user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const pdfRef = useRef();

  const handleDownloadPDF = async () => {
    setExporting(true);
    const element = pdfRef.current;
    
    // Add temporary class to ensure best PDF rendering
    element.classList.add("pdf-export-mode");
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${metadata?.destination || "my-trip"}-itinerary.pdf`);
    } catch (err) {
      console.error("PDF Export failed", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      element.classList.remove("pdf-export-mode");
      setExporting(false);
    }
  };


  const handleSave = async () => {
    if (!token) return;
    if (!metadata?.destination) {
      alert("Missing trip destination. Please try generating a new trip first.");
      return;
    }
    setSaving(true);
    try {
      await axios.post(
        "http://localhost:5000/trips/save",
        {
          destination: metadata?.destination,
          days: metadata?.days,
          budget: metadata?.budget,
          travelers: metadata?.travelers,
          itinerary: plan
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save trip: " + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };
  if (!plan || !Array.isArray(plan)) return null;

  return (
    <div ref={pdfRef} className="w-full mt-4 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-1 before:bg-gradient-to-b before:from-blue-100 before:via-indigo-200 before:to-transparent">
      
      {plan.map((day, index) => (
        <div
          key={index}
          className="relative flex items-start w-full mb-12 group last:mb-0"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          {/* Timeline Dot */}
          <div className="absolute left-5 transform -translate-x-1/2 mt-2 flex items-center justify-center w-5 h-5 rounded-full bg-white border-[3px] border-blue-500 shadow-lg z-10 group-hover:scale-125 group-hover:border-indigo-600 transition-all duration-500">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-indigo-600 transition-colors"></div>
          </div>

          <div className="w-full ml-12 bg-white/60 p-6 md:p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 border border-white/80 backdrop-blur-xl group-hover:bg-white/90">
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/20 transform group-hover:rotate-3 transition-transform duration-500">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    {typeof day.day === 'number' ? `Day ${day.day}` : day.day}
                  </h3>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-blue-600/70 uppercase tracking-widest">{day.places.length} Destinations</p>
                    {day.description && <span className="text-slate-300">•</span>}
                    {day.description && <p className="text-sm font-medium text-slate-500 italic">{day.description}</p>}
                  </div>
                </div>
              </div>
 
               <div className="flex items-center gap-3">
                 <button
                   onClick={handleDownloadPDF}
                   disabled={exporting}
                   className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                 >
                   {exporting ? (
                     "Processing..."
                   ) : (
                     <>
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                       Download PDF
                     </>
                   )}
                 </button>

                 {user && (
                   <button
                     onClick={handleSave}
                     disabled={saving || saved}
                     className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all transform active:scale-95 shadow-lg ${
                       saved 
                         ? "bg-green-500 text-white shadow-green-500/20" 
                         : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10"
                     } disabled:opacity-70`}
                   >
                     {saved ? (
                       <>
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                         Saved!
                       </>
                     ) : (
                       <>
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                         {saving ? "Saving..." : "Save Journey"}
                       </>
                     )}
                   </button>
                 )}
               </div>
             </div>

            <ul className="space-y-6">
              {day.places.map((place, i) => {
                const isObject = typeof place === "object" && place !== null;
                const placeName = isObject ? place.name : place;
                const placeDetails = isObject ? place.details : "";

                return (
                  <li 
                    key={i} 
                    className="text-slate-600 flex items-start gap-5 p-5 rounded-3xl hover:bg-white transition-all duration-300 border border-transparent hover:border-slate-100/80 shadow-none hover:shadow-xl hover:shadow-blue-900/5 group/item bg-slate-50/40 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="mt-1 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-2xl bg-white text-slate-900 font-black text-base group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-300 shadow-sm border border-slate-100 group-hover/item:border-blue-600 relative z-10">
                      {i + 1}
                    </div>
                    
                    <div className="relative z-10 w-full">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-extrabold text-slate-800 leading-tight block text-xl group-hover/item:text-blue-700 transition-colors uppercase tracking-tight">{placeName}</span>
                        
                        <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </div>
                      </div>
                      {placeDetails && (
                        <p className="text-slate-500 text-base mt-2 leading-relaxed pr-2 font-medium">{placeDetails}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

          </div>
        </div>
      ))}

    </div>
  );
}