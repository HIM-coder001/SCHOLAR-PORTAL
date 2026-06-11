import { useState } from "react";
import Sidebar from "../components/shared/Sidebar";
import Footer from "../components/shared/Footer";
import { 
  Sparkles, 
  Share2, 
  MoreVertical, 
  Plus, 
  FileText, 
  Lightbulb, 
  Paperclip, 
  Send,
  CloudUpload,
  Bell,
  CheckCircle2
} from "lucide-react";

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Welcome, Scholar! I'm your dedicated research assistant. I can help you summarize complex papers, explain difficult concepts in simple terms, or even cite sources for your thesis. How can I assist your studies today?",
      options: [
        { title: "Summarize my last PDF", subtitle: "Get key takeaways in seconds.", icon: FileText },
        { title: "Explain Quantum Entanglement", subtitle: "Simplified for undergraduate level.", icon: Lightbulb }
      ]
    },
    {
      sender: "user",
      text: "Can you explain the main differences between MIT and BSD licenses for my computer science project?",
      attachment: "license_comparison.pdf"
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [sessions, setSessions] = useState([
    { title: "Cell Division Summary", time: "2 hours ago" },
    { title: "Statistical Analysis Help", time: "Yesterday" },
    { title: "Latex Formatting Guide", time: "Oct 24, 2024" }
  ]);

  const triggerToast = (message) => {
    setToast({ show: true, message });
    const timer = setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3500);
    return () => clearTimeout(timer);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: inputVal }]);
    const currentInput = inputVal;
    setInputVal("");

    // Simulate AI typing response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Regarding your query "${currentInput}": I am analyzing the relevant academic guidelines. MIT and BSD are both highly permissive open-source licenses. The main difference lies in advertising clauses and endorsement restrictions, particularly in 3-clause BSD. Let me know if you need specific legal citations!`
        }
      ]);
    }, 1200);
  };

  const startNewSession = () => {
    const title = prompt("Enter a topic for the new session:");
    if (!title) return;
    setSessions((prev) => [{ title, time: "Just now" }, ...prev]);
    setMessages([
      {
        sender: "ai",
        text: `Starting new research session: "${title}". How can I help you extract details, summarize text or cite papers today?`
      }
    ]);
    triggerToast(`Created new chat session: "${title}"`);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] flex font-sans text-gray-800">
      <Sidebar />

      {/* Main Container (ml-64) */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen relative">
        
        {/* Top Header */}
        <header className="flex items-center justify-between px-8 py-3.5 bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="flex items-center gap-8">
            <span className="text-base font-bold text-gray-500 hover:text-gray-800 cursor-pointer">Library</span>
            <span className="text-base font-extrabold text-emerald-800 border-b-2 border-emerald-800 pb-1.5 cursor-pointer">AI Assistant</span>
            <span className="text-base font-bold text-gray-500 hover:text-gray-800 cursor-pointer">Collections</span>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-5">
            <button 
              onClick={() => triggerToast("No new notifications.")}
              className="relative p-2 text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              <Bell size={22} className="stroke-[1.8]" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Alex Rivers avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* AI Assistant Layout Split */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Middle Column - Recent Conversations (width: 270px) */}
          <div className="w-68 border-r border-gray-150 flex flex-col justify-between p-6 bg-white shrink-0">
            <div className="space-y-7">
              {/* New Session Button */}
              <button 
                onClick={startNewSession}
                className="w-full bg-[#004D40] hover:bg-[#00382e] text-sm font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition cursor-pointer"
              >
                <Plus size={18} />
                <span>New Session</span>
              </button>

              {/* Sessions List */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">
                  Recent Conversations
                </h4>
                <div className="space-y-2">
                  {sessions.map((sess, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => {
                        triggerToast(`Loaded chat: "${sess.title}"`);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl transition cursor-pointer border ${
                        idx === 0 
                          ? "bg-gray-100/60 border-gray-200/50" 
                          : "border-transparent hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <h5 className="text-sm font-bold truncate text-gray-900">
                        {sess.title}
                      </h5>
                      <span className="text-xs text-gray-450 mt-1 block font-medium">
                        {sess.time}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Usage Limit Box */}
            <div className="bg-[#D2E7DF]/40 border border-[#D2E7DF]/60 rounded-2xl p-5">
              <h5 className="text-xs font-bold text-[#004D40] uppercase tracking-wider mb-2.5">
                Usage Limit
              </h5>
              <div className="w-full bg-emerald-100 rounded-full h-2.5 overflow-hidden mb-2.5">
                <div 
                  className="bg-[#004D40] h-full rounded-full transition-all duration-500"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <p className="text-xs font-bold text-emerald-800">
                750/1000 messages used
              </p>
            </div>
          </div>

          {/* Right Column - Chat Thread */}
          <div className="flex-1 flex flex-col justify-between bg-[#fbfcfa]">
            
            {/* Thread Header */}
            <div className="px-8 py-5 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#D2E7DF]/50 flex items-center justify-center text-[#004D40]">
                  <Sparkles size={22} className="stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 font-outfit leading-none">
                    Scholar Assistant
                  </h3>
                  <span className="text-xs text-gray-400 font-bold mt-1.5 block">
                    Powered by Advanced Academic Models
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => triggerToast("Link copied to clipboard!")}
                  className="p-2.5 text-gray-400 hover:text-gray-650 hover:bg-gray-50 rounded-xl transition cursor-pointer"
                >
                  <Share2 size={18} />
                </button>
                <button className="p-2.5 text-gray-400 hover:text-gray-650 hover:bg-gray-50 rounded-xl transition cursor-pointer">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((msg, i) => {
                if (msg.sender === "ai") {
                  return (
                    <div key={i} className="flex gap-4.5 items-start max-w-2xl">
                      <div className="w-9 h-9 rounded-xl bg-[#D2E7DF] flex items-center justify-center text-[#004D40] shrink-0 shadow-sm border border-[#D2E7DF]/30">
                        <Sparkles size={16} className="stroke-[2.2]" />
                      </div>
                      <div className="space-y-4 flex-1">
                        {/* Text bubble */}
                        <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm text-sm text-gray-700 leading-relaxed font-semibold">
                          {msg.text}
                        </div>

                        {/* Quick Suggestions Cards */}
                        {msg.options && (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {msg.options.map((opt, oIdx) => {
                              const OptIcon = opt.icon;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => {
                                    setInputVal(opt.title);
                                    triggerToast(`Selected topic prompt: "${opt.title}"`);
                                  }}
                                  className="text-left bg-white border border-gray-150 hover:border-emerald-600/30 rounded-2xl p-4.5 shadow-sm hover:shadow transition flex gap-3.5 cursor-pointer group"
                                >
                                  <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-emerald-50 text-gray-500 group-hover:text-emerald-800 transition flex items-center justify-center shrink-0 border border-gray-100">
                                    <OptIcon size={16} />
                                  </div>
                                  <div>
                                    <h5 className="text-sm font-extrabold text-gray-800 group-hover:text-[#004D40] transition">
                                      {opt.title}
                                    </h5>
                                    <span className="text-xs text-gray-400 font-bold block mt-0.5">
                                      {opt.subtitle}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={i} className="flex gap-4 justify-end items-start">
                      <div className="flex gap-3.5 items-start max-w-xl">
                        {/* Chat bubble */}
                        <div className="bg-[#004D40] text-white rounded-3xl p-5 shadow-md text-sm leading-relaxed font-semibold">
                          {msg.text}
                        </div>

                        {/* Optional thumbnail attachment */}
                        {msg.attachment && (
                          <div 
                            onClick={() => triggerToast(`Viewing document "${msg.attachment}"...`)}
                            className="w-14 h-16 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center justify-center shrink-0 relative group cursor-pointer hover:border-emerald-600 transition"
                          >
                            <FileText size={20} className="text-rose-500" />
                            <span className="text-[9px] font-bold text-gray-400 absolute bottom-1.5 uppercase">
                              PDF
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              })}

              {/* Typing indicator */}
              {messages[messages.length - 1].sender === "user" && (
                <div className="flex gap-4.5 items-start">
                  <div className="w-9 h-9 rounded-xl bg-[#D2E7DF] flex items-center justify-center text-[#004D40] shrink-0 border border-[#D2E7DF]/30">
                    <Sparkles size={16} />
                  </div>
                  <div className="bg-[#f0f2f0] px-5 py-3 rounded-2xl text-emerald-800 flex items-center justify-center gap-1 shadow-sm">
                    <span className="w-2 h-2 bg-[#004D40] rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-[#004D40] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-[#004D40] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

              {/* Uploader Box Component */}
              <div className="border-2 border-dashed border-emerald-650/20 hover:border-emerald-650/40 bg-emerald-50/5 rounded-3xl p-8 text-center flex flex-col items-center justify-center max-w-2xl mx-auto my-8 transition">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 mb-4 border border-emerald-250">
                  <CloudUpload size={26} className="stroke-[1.8]" />
                </div>
                <h4 className="text-sm font-extrabold text-gray-800">
                  Drop scholarly documents here
                </h4>
                <p className="text-xs text-gray-400 font-bold mt-1.5 mb-5">
                  PDF, DOCX, or LaTeX (Max 50MB)
                </p>
                <button 
                  onClick={() => triggerToast("Browsing files on local storage...")}
                  className="bg-white border border-gray-300 hover:border-[#004D40] text-gray-700 hover:text-[#004D40] text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
                >
                  Browse Files
                </button>
              </div>
            </div>

            {/* Input Bar Form */}
            <div className="px-8 py-5 bg-white border-t border-gray-100">
              <form onSubmit={handleSend} className="relative flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-3 max-w-4xl mx-auto">
                <button 
                  type="button" 
                  onClick={() => triggerToast("Add document attachment...")}
                  className="p-2 text-gray-400 hover:text-gray-655 transition cursor-pointer"
                >
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask a scholarly question..."
                  className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full px-3.5 py-1 font-semibold"
                />
                <button 
                  type="submit" 
                  className="w-10 h-10 bg-[#004D40] hover:bg-[#00382e] text-white rounded-xl flex items-center justify-center shadow-md transition shrink-0 cursor-pointer"
                >
                  <Send size={16} className="stroke-[2.2]" />
                </button>
              </form>
              
              <p className="text-[10px] text-gray-400 font-bold text-center mt-3.5 uppercase tracking-wider">
                AI can make mistakes. Please verify important citations in the official library archives.
              </p>
            </div>

          </div>

        </div>

        {/* Global Toast */}
        {toast.show && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#004D40] text-white text-xs font-bold px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 z-50 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
