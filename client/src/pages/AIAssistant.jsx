import { useState, useEffect } from "react";
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
  CheckCircle2,
  Lock,
  Smartphone,
  Coins
} from "lucide-react";

const AIAssistant = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });
  
  // User credits states
  const [userMeta, setUserMeta] = useState({ messageCount: 750, messageLimit: 1000 });
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // M-Pesa Payment Modal states
  const [showPayModal, setShowPayModal] = useState(false);
  const [phoneVal, setPhoneVal] = useState("0712345678");
  const [payAmount, setPayAmount] = useState("100");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [paySuccess, setPaySuccess] = useState("");

  const triggerToast = (message) => {
    setToast({ show: true, message });
    const timer = setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3500);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    fetchSessions();
    fetchUserMeta();
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      fetchMessages(selectedSessionId);
    } else {
      setMessages([]);
    }
  }, [selectedSessionId]);

  const fetchUserMeta = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserMeta({
          messageCount: data.messageCount ?? 750,
          messageLimit: data.messageLimit ?? 1000
        });
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  };

  const fetchSessions = async (selectFirst = true) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/chats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
        if (selectFirst && data.length > 0) {
          setSelectedSessionId(data[0]._id);
        }
      }
    } catch (err) {
      console.error("Fetch sessions error:", err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchMessages = async (sessionId) => {
    setLoadingMessages(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/chats/${sessionId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || !selectedSessionId) return;

    const userText = inputVal;
    setInputVal("");

    // Optimistically add user message to list
    const tempUserMsg = { _id: Date.now().toString(), sender: "user", text: userText };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/chats/${selectedSessionId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: userText })
      });

      const data = await res.json();

      if (res.ok) {
        // Update local credits metrics returned from API response
        setUserMeta({
          messageCount: data.messageCount,
          messageLimit: data.messageLimit
        });
        // Reload messages thread
        fetchMessages(selectedSessionId);
      } else {
        // If error was limits breach, refresh metrics
        if (res.status === 403 && data.limitReached) {
          setUserMeta({
            messageCount: data.messageCount,
            messageLimit: data.messageLimit
          });
        }
        triggerToast(data.message || "Failed to deliver message.");
        // Clear optimistic user bubble by reloading
        fetchMessages(selectedSessionId);
      }
    } catch (err) {
      console.error("Send message error:", err);
      triggerToast("Error sending message to server.");
      fetchMessages(selectedSessionId);
    }
  };

  const startNewSession = async () => {
    const title = prompt("Enter a topic/course name for the new chat session:");
    if (!title) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });

      if (res.ok) {
        const newSession = await res.json();
        await fetchSessions(false);
        setSelectedSessionId(newSession._id);
        triggerToast(`Created session: "${title}"`);
      } else {
        triggerToast("Failed to create new session.");
      }
    } catch (err) {
      console.error("Create session error:", err);
      triggerToast("Error connecting to server.");
    }
  };

  // M-Pesa Top Up submit handler
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPayError("");
    setPaySuccess("");
    setPaying(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/payment/mpesa-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ phone: phoneVal, amount: payAmount })
      });

      const data = await res.json();

      if (res.ok) {
        setPaySuccess(data.message);
        setUserMeta({
          messageCount: data.messageCount,
          messageLimit: data.messageLimit
        });
        triggerToast("M-Pesa top-up successfully credited!");
        setTimeout(() => {
          setShowPayModal(false);
          setPaySuccess("");
        }, 3000);
      } else {
        setPayError(data.message || "Payment simulation failed.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPayError("Network connection failure. Try again.");
    } finally {
      setPaying(false);
    }
  };

  const isLimitReached = userMeta.messageCount >= userMeta.messageLimit;
  const usagePercentage = Math.min(100, (userMeta.messageCount / userMeta.messageLimit) * 100);

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
                
                {loadingSessions ? (
                  <div className="text-xs text-gray-400 p-2 font-bold">Loading chats...</div>
                ) : (
                  <div className="space-y-2">
                    {sessions.map((sess) => (
                      <button 
                        key={sess._id} 
                        onClick={() => {
                          setSelectedSessionId(sess._id);
                          triggerToast(`Loaded chat: "${sess.title}"`);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl transition cursor-pointer border ${
                          selectedSessionId === sess._id 
                            ? "bg-[#D2E7DF]/30 border-emerald-300/40 text-emerald-950 font-bold" 
                            : "border-transparent hover:bg-gray-50 text-gray-700 font-semibold"
                        }`}
                      >
                        <h5 className="text-sm font-bold truncate">
                          {sess.title}
                        </h5>
                        <span className="text-xs text-gray-455 mt-1 block font-medium">
                          {new Date(sess.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      </button>
                    ))}

                    {sessions.length === 0 && (
                      <div className="text-center py-6 text-xs text-gray-400 font-bold border border-dashed rounded-xl">
                        No previous chats.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Usage Limit Box with TopUp Action */}
            <div className="bg-[#D2E7DF]/40 border border-[#D2E7DF]/60 rounded-2xl p-5 flex flex-col">
              <div className="flex items-center justify-between mb-2.5">
                <h5 className="text-xs font-bold text-[#004D40] uppercase tracking-wider">
                  Usage Limit
                </h5>
                <button 
                  onClick={() => setShowPayModal(true)}
                  className="text-[10px] font-black uppercase text-emerald-900 bg-white/60 hover:bg-white px-2 py-0.5 rounded border border-emerald-300/30 transition cursor-pointer"
                >
                  Top Up
                </button>
              </div>
              
              <div className="w-full bg-emerald-100 rounded-full h-2.5 overflow-hidden mb-2.5">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isLimitReached ? "bg-red-500" : "bg-[#004D40]"}`}
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
              <p className="text-xs font-bold text-emerald-800">
                {userMeta.messageCount}/{userMeta.messageLimit} messages used
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
                  className="p-2.5 text-gray-400 hover:text-gray-655 hover:bg-gray-50 rounded-xl transition cursor-pointer"
                >
                  <Share2 size={18} />
                </button>
                <button className="p-2.5 text-gray-400 hover:text-gray-655 hover:bg-gray-50 rounded-xl transition cursor-pointer">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {loadingMessages ? (
                <div className="text-center py-12 text-xs text-gray-400 font-bold">Loading conversation thread...</div>
              ) : (
                messages.map((msg, i) => {
                  if (msg.sender === "ai") {
                    return (
                      <div key={msg._id || i} className="flex gap-4.5 items-start max-w-2xl">
                        <div className="w-9 h-9 rounded-xl bg-[#D2E7DF] flex items-center justify-center text-[#004D40] shrink-0 shadow-sm border border-[#D2E7DF]/30">
                          <Sparkles size={16} className="stroke-[2.2]" />
                        </div>
                        <div className="space-y-4 flex-1">
                          {/* Text bubble */}
                          <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm text-sm text-gray-700 leading-relaxed font-semibold markdown-chat-content">
                            {msg.text.split("\n").map((line, lIdx) => {
                              if (line.startsWith("###")) {
                                return <h4 key={lIdx} className="text-base font-extrabold text-emerald-950 font-outfit mb-3">{line.replace("###", "")}</h4>;
                              }
                              if (line.startsWith("* **")) {
                                return <p key={lIdx} className="text-xs leading-relaxed font-bold mt-2 text-gray-700">{line.replace("*", "")}</p>;
                              }
                              if (line.startsWith("-") || line.startsWith("*")) {
                                return <li key={lIdx} className="text-xs list-disc pl-4 mt-1 leading-relaxed text-gray-600">{line.substring(1).trim()}</li>;
                              }
                              return <p key={lIdx} className="mb-2">{line}</p>;
                            })}
                          </div>

                          {/* Quick Suggestions Cards (only for first message) */}
                          {i === 0 && (
                            <div className="grid sm:grid-cols-2 gap-4">
                              <button
                                onClick={() => {
                                  if (isLimitReached) {
                                    triggerToast("Credit limit reached! Unlock with M-Pesa.");
                                    return;
                                  }
                                  setInputVal("Summarize my study topic");
                                  triggerToast('Suggested prompt: "Summarize topic"');
                                }}
                                className="text-left bg-white border border-gray-150 hover:border-emerald-600/30 rounded-2xl p-4.5 shadow-sm hover:shadow transition flex gap-3.5 cursor-pointer group"
                              >
                                <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-emerald-50 text-gray-500 group-hover:text-emerald-800 transition flex items-center justify-center shrink-0 border border-gray-100">
                                  <FileText size={16} />
                                </div>
                                <div>
                                  <h5 className="text-sm font-extrabold text-gray-800 group-hover:text-[#004D40] transition">
                                    Summarize a Topic
                                  </h5>
                                  <span className="text-xs text-gray-400 font-bold block mt-0.5">
                                    Get key takeaways in seconds.
                                  </span>
                                </div>
                              </button>

                              <button
                                onClick={() => {
                                  if (isLimitReached) {
                                    triggerToast("Credit limit reached! Unlock with M-Pesa.");
                                    return;
                                  }
                                  setInputVal("Give notes on Mitosis phases");
                                  triggerToast('Suggested prompt: "Give notes on Mitosis"');
                                }}
                                className="text-left bg-white border border-gray-150 hover:border-emerald-600/30 rounded-2xl p-4.5 shadow-sm hover:shadow transition flex gap-3.5 cursor-pointer group"
                              >
                                <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-emerald-50 text-gray-500 group-hover:text-emerald-800 transition flex items-center justify-center shrink-0 border border-gray-100">
                                  <Lightbulb size={16} />
                                </div>
                                <div>
                                  <h5 className="text-sm font-extrabold text-gray-800 group-hover:text-[#004D40] transition">
                                    Create Short Notes
                                  </h5>
                                  <span className="text-xs text-gray-400 font-bold block mt-0.5">
                                    Simplified revision notes.
                                  </span>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={msg._id || i} className="flex gap-4 justify-end items-start">
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
                })
              )}

              {/* Typing indicator */}
              {!loadingMessages && messages.length > 0 && messages[messages.length - 1].sender === "user" && (
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
                  onClick={() => {
                    if (isLimitReached) {
                      triggerToast("Limit reached! Click Top Up to buy credits.");
                      return;
                    }
                    // Simulate attachment upload
                    setMessages(prev => [...prev, {
                      _id: Date.now().toString(),
                      sender: "user",
                      text: "Analyze this homework document for me.",
                      attachment: "mit_licensing_details.pdf"
                    }]);
                    triggerToast("Attached file: mit_licensing_details.pdf");
                  }}
                  className="bg-white border border-gray-300 hover:border-[#004D40] text-gray-700 hover:text-[#004D40] text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
                >
                  Browse Files
                </button>
              </div>
            </div>

            {/* Input Bar Form with Lock Banner */}
            <div className="px-8 py-5 bg-white border-t border-gray-100">
              
              {/* Alert Limit Reached Warning banner */}
              {isLimitReached && (
                <div className="mb-4 p-4 bg-rose-50 border border-rose-200/50 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <Lock size={16} />
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-rose-950">Usage Limit Reached</h5>
                      <p className="text-[11px] text-rose-700/80 font-bold mt-0.5">Please purchase credits using M-Pesa to unlock the assistant.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPayModal(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition shadow-md shadow-rose-950/15 cursor-pointer"
                  >
                    Buy Credits
                  </button>
                </div>
              )}

              <form onSubmit={handleSend} className="relative flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-3 max-w-4xl mx-auto">
                <button 
                  type="button" 
                  disabled={isLimitReached}
                  onClick={() => triggerToast("Add document attachment...")}
                  className="p-2 text-gray-400 hover:text-gray-655 transition cursor-pointer disabled:opacity-40"
                >
                  <Paperclip size={20} />
                </button>
                
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={
                    isLimitReached 
                      ? "Chat is locked. Please top up using M-Pesa..." 
                      : selectedSessionId 
                        ? "Ask a scholarly question... (e.g. summarize mitosis / notes on licensing)" 
                        : "Create or select a chat session to begin..."
                  }
                  disabled={!selectedSessionId || isLimitReached}
                  className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full px-3.5 py-1 font-semibold disabled:cursor-not-allowed"
                />
                
                <button 
                  type="submit" 
                  disabled={!selectedSessionId || isLimitReached}
                  className="w-10 h-10 bg-[#004D40] hover:bg-[#00382e] text-white rounded-xl flex items-center justify-center shadow-md transition shrink-0 cursor-pointer disabled:bg-gray-200 disabled:text-gray-400"
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

        {/* M-Pesa STK Push Payment Modal popup Dialog */}
        {showPayModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <Coins size={20} className="stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 font-outfit">Top Up Credits</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Safaricom M-Pesa</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (!paying) setShowPayModal(false);
                  }}
                  className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1 cursor-pointer"
                >
                  ×
                </button>
              </div>

              {/* Error/Success display inside modal */}
              {payError && (
                <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-xl">
                  {payError}
                </div>
              )}
              {paySuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-850 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>{paySuccess}</span>
                </div>
              )}

              {/* Payment Form */}
              <form onSubmit={handlePaymentSubmit} className="space-y-5">
                
                {/* Package Options */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2.5">
                    Select Credit Package
                  </label>
                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => setPayAmount("50")}
                      className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between h-24 cursor-pointer ${
                        payAmount === "50"
                          ? "border-[#004D40] bg-emerald-50/10 text-[#004D40]"
                          : "border-gray-150 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span className="text-xs font-extrabold uppercase tracking-wider">250 Msgs</span>
                      <span className="text-base font-black font-outfit">KES 50</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPayAmount("100")}
                      className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between h-24 cursor-pointer ${
                        payAmount === "100"
                          ? "border-[#004D40] bg-emerald-50/10 text-[#004D40]"
                          : "border-gray-150 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span className="text-xs font-extrabold uppercase tracking-wider">500 Msgs</span>
                      <span className="text-base font-black font-outfit">KES 100</span>
                    </button>
                  </div>
                </div>

                {/* M-Pesa Phone Number input */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                      <Smartphone size={18} />
                    </span>
                    <input
                      type="text"
                      required
                      value={phoneVal}
                      onChange={(e) => setPhoneVal(e.target.value)}
                      placeholder="e.g. 0712345678"
                      disabled={paying}
                      className="w-full bg-[#f8faf8] border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#004D40] shadow-sm transition font-bold text-gray-700"
                    />
                  </div>
                </div>

                {/* Info Text */}
                <p className="text-[11px] text-gray-400 font-bold leading-normal">
                  Clicking the button below will initiate an M-Pesa STK Push. Please enter your M-Pesa PIN on your phone prompt to complete the transaction.
                </p>

                {/* Pay Action button */}
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    disabled={paying}
                    onClick={() => setShowPayModal(false)}
                    className="flex-1 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-750 text-sm font-bold rounded-2xl transition cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={paying || !phoneVal}
                    className="flex-1 py-3.5 bg-[#004D40] hover:bg-[#00382e] text-white text-sm font-bold rounded-2xl shadow-lg shadow-emerald-950/15 transition cursor-pointer flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                  >
                    {paying ? (
                      <>
                        <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Pay KES {payAmount}</span>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AIAssistant;
