import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/shared/Sidebar";
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
  Coins,
  Menu,
  X,
  MessageSquare
} from "lucide-react";

const AIAssistant = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });
  
  // Responsive UI states
  const [showSessionsDrawer, setShowSessionsDrawer] = useState(false);
  const messagesEndRef = useRef(null);
  
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
    setTimeout(() => setToast({ show: false, message: "" }), 3500);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchSessions();
    fetchUserMeta();
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      fetchMessages(selectedSessionId);
      setShowSessionsDrawer(false); // Close drawer on mobile when session selected
    } else {
      setMessages([]);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingMessages]);

  const fetchUserMeta = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setUserMeta({ messageCount: data.messageCount ?? 750, messageLimit: data.messageLimit ?? 1000 });
      }
    } catch (err) { console.error(err); }
  };

  const fetchSessions = async (selectFirst = true) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/chats", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
        if (selectFirst && data.length > 0) setSelectedSessionId(data[0]._id);
      }
    } catch (err) { console.error(err); } 
    finally { setLoadingSessions(false); }
  };

  const fetchMessages = async (sessionId) => {
    setLoadingMessages(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/chats/${sessionId}/messages`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setMessages(await res.json());
    } catch (err) { console.error(err); } 
    finally { setLoadingMessages(false); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || !selectedSessionId) return;

    const userText = inputVal;
    setInputVal("");

    const tempUserMsg = { _id: Date.now().toString(), sender: "user", text: userText };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/chats/${selectedSessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: userText })
      });
      const data = await res.json();
      if (res.ok) {
        setUserMeta({ messageCount: data.messageCount, messageLimit: data.messageLimit });
        fetchMessages(selectedSessionId);
      } else {
        if (res.status === 403 && data.limitReached) {
          setUserMeta({ messageCount: data.messageCount, messageLimit: data.messageLimit });
        }
        triggerToast(data.message || "Failed to deliver message.");
        fetchMessages(selectedSessionId);
      }
    } catch (err) {
      triggerToast("Error sending message to server.");
      fetchMessages(selectedSessionId);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSessionId) return;
    
    if (file.type !== "application/pdf") {
      triggerToast("Only PDF files are supported currently.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      triggerToast("File size must be under 50MB.");
      return;
    }
    if (isLimitReached) {
      triggerToast("Usage limit reached. Please buy credits via M-Pesa.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    const tempMsgId = Date.now().toString();
    setMessages((prev) => [...prev, { _id: tempMsgId, sender: "user", text: "Uploading PDF...", attachment: file.name }]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/chats/${selectedSessionId}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setUserMeta({ messageCount: data.messageCount, messageLimit: data.messageLimit });
        fetchMessages(selectedSessionId);
        triggerToast("PDF analyzed successfully.");
      } else {
        triggerToast(data.message || "Failed to upload file.");
        setMessages((prev) => prev.filter(m => m._id !== tempMsgId));
      }
    } catch (err) {
      triggerToast("Network error uploading file.");
      setMessages((prev) => prev.filter(m => m._id !== tempMsgId));
    }
  };

  const startNewSession = async () => {
    const title = prompt("Enter a topic/course name for the new chat session:");
    if (!title) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title })
      });
      if (res.ok) {
        const newSession = await res.json();
        await fetchSessions(false);
        setSelectedSessionId(newSession._id);
        triggerToast(`Created session: "${title}"`);
      }
    } catch (err) { triggerToast("Error connecting to server."); }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPayError(""); setPaySuccess(""); setPaying(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/payment/mpesa-push", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ phone: phoneVal, amount: payAmount })
      });
      const data = await res.json();
      if (res.ok) {
        setPaySuccess(data.message);
        setUserMeta({ messageCount: data.messageCount, messageLimit: data.messageLimit });
        triggerToast("M-Pesa top-up successfully credited!");
        setTimeout(() => { setShowPayModal(false); setPaySuccess(""); }, 3000);
      } else {
        setPayError(data.message || "Payment simulation failed.");
      }
    } catch (err) { setPayError("Network connection failure. Try again."); } 
    finally { setPaying(false); }
  };

  const isLimitReached = userMeta.messageCount >= userMeta.messageLimit;
  const usagePercentage = Math.min(100, (userMeta.messageCount / userMeta.messageLimit) * 100);

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex font-sans text-gray-800">
      <Sidebar />

      {/* Main Container */}
      <div className="lg:ml-64 flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 shrink-0">
          <div className="flex items-center gap-4 ml-12 lg:ml-0">
            <button 
              className="lg:hidden p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition"
              onClick={() => setShowSessionsDrawer(true)}
            >
              <MessageSquare size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-6">
              <span className="text-sm font-extrabold text-gray-400 hover:text-gray-800 cursor-pointer transition">Library</span>
              <span className="text-sm font-extrabold text-[#004D40] border-b-2 border-[#004D40] pb-1 cursor-pointer">AI Assistant</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-[#004D40] bg-gray-50 rounded-full transition cursor-pointer hidden sm:block">
              <Bell size={18} className="stroke-[2.5]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* AI Assistant Layout Split */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Mobile Sessions Overlay */}
          {showSessionsDrawer && (
            <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setShowSessionsDrawer(false)} />
          )}

          {/* Left Column - Sessions List */}
          <div className={`
            absolute lg:relative top-0 left-0 h-full bg-white z-40 w-72 lg:w-80 border-r border-gray-100 
            flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
            ${showSessionsDrawer ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}>
            <div className="flex flex-col h-full overflow-hidden p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-extrabold text-gray-900 font-outfit">
                  Conversations
                </h4>
                <button className="lg:hidden p-1 text-gray-400" onClick={() => setShowSessionsDrawer(false)}>
                  <X size={20} />
                </button>
              </div>

              <button 
                onClick={startNewSession}
                className="w-full bg-[#004D40] hover:bg-[#00382e] text-white text-sm font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#004D40]/20 transition shrink-0 mb-6"
              >
                <Plus size={18} />
                <span>New Session</span>
              </button>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {loadingSessions ? (
                  <div className="text-sm text-gray-400 font-bold animate-pulse">Loading...</div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-6 text-sm text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-2xl">
                    No chats yet.
                  </div>
                ) : (
                  sessions.map((sess) => (
                    <button 
                      key={sess._id} 
                      onClick={() => setSelectedSessionId(sess._id)}
                      className={`w-full text-left p-4 rounded-2xl transition border ${
                        selectedSessionId === sess._id 
                          ? "bg-emerald-50/50 border-[#004D40]/20 text-[#004D40] font-bold shadow-sm" 
                          : "border-transparent hover:bg-gray-50 text-gray-600 font-semibold"
                      }`}
                    >
                      <h5 className="text-sm truncate leading-snug">{sess.title}</h5>
                      <span className="text-[10px] text-gray-400 mt-1.5 block font-bold uppercase tracking-widest">
                        {new Date(sess.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Usage Limit Box */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">
                    Usage
                  </h5>
                  <button 
                    onClick={() => setShowPayModal(true)}
                    className="text-[10px] font-black uppercase text-white bg-[#004D40] hover:bg-[#00382e] px-2.5 py-1 rounded-lg transition"
                  >
                    Top Up
                  </button>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className={`h-full rounded-full transition-all duration-500 ${isLimitReached ? "bg-rose-500" : "bg-[#004D40]"}`} style={{ width: `${usagePercentage}%` }} />
                </div>
                <p className="text-xs font-extrabold text-gray-700">
                  {userMeta.messageCount} / {userMeta.messageLimit} <span className="text-gray-400 font-semibold">msgs</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Chat Thread */}
          <div className="flex-1 flex flex-col bg-[#fcfdfc] relative">
            
            {/* Thread Header */}
            <div className="px-6 py-4 bg-white/60 backdrop-blur-md border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-[#004D40] shadow-sm">
                  <Sparkles size={20} className="stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 font-outfit">Scholar Assistant</h3>
                  <span className="text-xs text-gray-400 font-bold block mt-0.5">Academic AI Engine</span>
                </div>
              </div>
              <button className="p-2.5 text-gray-400 hover:text-[#004D40] bg-white border border-gray-100 rounded-xl shadow-sm transition">
                <Share2 size={16} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth custom-scrollbar pb-32">
              {loadingMessages ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
                  <div className="w-6 h-6 border-2 border-[#004D40] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-bold">Syncing knowledge base...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-[#004D40]">
                    <Sparkles size={36} className="stroke-[1.5]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 font-outfit mb-2">How can I help you study?</h2>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      I can summarize notes, extract insights from long PDFs, or answer complex academic questions based on scholarly archives.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={msg._id || i} className={`flex gap-4 items-start ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                    
                    {msg.sender === "ai" && (
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-[#004D40] shrink-0 shadow-sm border border-emerald-100/50 mt-1">
                        <Sparkles size={18} className="stroke-[2]" />
                      </div>
                    )}
                    
                    {msg.sender === "user" && (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0 mt-1 shadow-sm">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User" />
                      </div>
                    )}

                    <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-2xl ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                      <div className={`p-5 rounded-3xl text-sm leading-relaxed font-medium shadow-sm
                        ${msg.sender === "ai" 
                          ? "bg-white border border-gray-100 text-gray-700 rounded-tl-sm" 
                          : "bg-[#004D40] text-white rounded-tr-sm"}`
                      }>
                        {msg.sender === "ai" ? (
                          <div className="space-y-3 markdown-chat-content">
                            {msg.text.split("\n").map((line, lIdx) => {
                              if (line.startsWith("###")) return <h4 key={lIdx} className="text-base font-extrabold text-gray-900 font-outfit mb-2">{line.replace("###", "")}</h4>;
                              if (line.startsWith("* **")) return <p key={lIdx} className="font-bold text-gray-800 mt-2">{line.replace("*", "")}</p>;
                              if (line.startsWith("-") || line.startsWith("*")) return <li key={lIdx} className="list-disc ml-4 text-gray-600">{line.substring(1).trim()}</li>;
                              if (line.startsWith(">")) return <blockquote key={lIdx} className="pl-4 border-l-2 border-[#004D40] text-gray-500 italic my-2">{line.substring(1)}</blockquote>;
                              return <p key={lIdx}>{line}</p>;
                            })}
                          </div>
                        ) : (
                          <p>{msg.text}</p>
                        )}
                      </div>

                      {msg.attachment && (
                        <div className="px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm flex items-center gap-3">
                          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                            <FileText size={18} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-800 block truncate max-w-[150px]">{msg.attachment}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">PDF Document</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Area */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#fcfdfc] via-[#fcfdfc] to-transparent pt-10 pb-6 px-6 md:px-8">
              
              {isLimitReached && (
                <div className="max-w-4xl mx-auto mb-4 p-4 bg-rose-50 border border-rose-200/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Lock size={18} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <h5 className="text-sm font-extrabold text-rose-950">Usage Limit Reached</h5>
                      <p className="text-xs text-rose-700/80 font-bold mt-0.5">Please purchase credits to unlock the AI.</p>
                    </div>
                  </div>
                  <button onClick={() => setShowPayModal(true)} className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-extrabold px-5 py-2.5 rounded-xl transition shadow-md shadow-rose-600/20">
                    Top Up Now
                  </button>
                </div>
              )}

              <form onSubmit={handleSend} className="relative flex items-center bg-white border border-gray-200 rounded-[2rem] p-2.5 max-w-4xl mx-auto shadow-lg shadow-gray-200/40 focus-within:border-[#004D40]/40 focus-within:ring-4 focus-within:ring-[#004D40]/5 transition-all">
                
                <label className={`p-3 text-gray-400 hover:text-[#004D40] bg-gray-50 hover:bg-emerald-50 rounded-full transition cursor-pointer shrink-0 ${isLimitReached ? "opacity-50 pointer-events-none" : ""}`}>
                  <Paperclip size={20} className="stroke-[2]" />
                  <input type="file" className="hidden" accept="application/pdf" onChange={handleFileUpload} disabled={!selectedSessionId || isLimitReached} />
                </label>
                
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={
                    isLimitReached ? "Chat is locked..." : 
                    selectedSessionId ? "Ask a scholarly question... (e.g. summarize my notes)" : 
                    "Select a chat session to begin..."
                  }
                  disabled={!selectedSessionId || isLimitReached}
                  className="bg-transparent text-sm md:text-base text-gray-800 placeholder-gray-400 outline-none w-full px-4 py-2 font-medium disabled:cursor-not-allowed"
                />
                
                <button 
                  type="submit" 
                  disabled={!selectedSessionId || isLimitReached || !inputVal.trim()}
                  className="w-12 h-12 bg-[#004D40] text-white rounded-full flex items-center justify-center shadow-md transition shrink-0 cursor-pointer disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none ml-2"
                >
                  <Send size={18} className="stroke-[2.5]" />
                </button>
              </form>
              <p className="text-[10px] text-gray-400 font-bold text-center mt-4 uppercase tracking-widest">
                AI can make mistakes. Verify critical academic citations.
              </p>
            </div>
          </div>
        </div>

        {toast.show && (
          <div className="fixed top-8 right-8 bg-[#004D40] text-white text-sm font-bold px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-top-4">
            <CheckCircle2 size={18} className="text-emerald-300" />
            <span>{toast.message}</span>
          </div>
        )}

        {showPayModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl border border-gray-100 flex flex-col gap-6 animate-in zoom-in-95">
              <div className="flex items-start justify-between border-b border-gray-100 pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#004D40] flex items-center justify-center shadow-sm">
                    <Coins size={24} className="stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 font-outfit">Top Up Credits</h3>
                    <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest mt-1">Safaricom M-Pesa</p>
                  </div>
                </div>
                <button onClick={() => !paying && setShowPayModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-full transition">
                  <X size={16} />
                </button>
              </div>

              {payError && <div className="p-4 bg-rose-50 text-rose-700 text-sm font-bold rounded-2xl border border-rose-100">{payError}</div>}
              {paySuccess && <div className="p-4 bg-emerald-50 text-[#004D40] text-sm font-bold rounded-2xl border border-emerald-100 flex items-center gap-2"><CheckCircle2 size={18} /><span>{paySuccess}</span></div>}

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">Select Package</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setPayAmount("50")} className={`p-5 rounded-2xl border-2 text-left transition flex flex-col justify-between h-28 ${payAmount === "50" ? "border-[#004D40] bg-[#004D40]/5" : "border-gray-100 hover:border-gray-200 bg-white"}`}>
                      <span className={`text-xs font-extrabold uppercase tracking-widest ${payAmount === "50" ? "text-[#004D40]" : "text-gray-500"}`}>250 Msgs</span>
                      <span className={`text-xl font-black font-outfit ${payAmount === "50" ? "text-[#004D40]" : "text-gray-900"}`}>KES 50</span>
                    </button>
                    <button type="button" onClick={() => setPayAmount("100")} className={`p-5 rounded-2xl border-2 text-left transition flex flex-col justify-between h-28 ${payAmount === "100" ? "border-[#004D40] bg-[#004D40]/5" : "border-gray-100 hover:border-gray-200 bg-white"}`}>
                      <span className={`text-xs font-extrabold uppercase tracking-widest ${payAmount === "100" ? "text-[#004D40]" : "text-gray-500"}`}>500 Msgs</span>
                      <span className={`text-xl font-black font-outfit ${payAmount === "100" ? "text-[#004D40]" : "text-gray-900"}`}>KES 100</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">Phone Number</label>
                  <div className="relative">
                    <Smartphone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" required value={phoneVal} onChange={(e) => setPhoneVal(e.target.value)} disabled={paying} className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#004D40] focus:ring-4 focus:ring-[#004D40]/10 transition" />
                  </div>
                </div>

                <button type="submit" disabled={paying || !phoneVal} className="w-full py-4 bg-[#004D40] hover:bg-[#00382e] text-white text-base font-bold rounded-2xl shadow-lg shadow-[#004D40]/20 transition flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:shadow-none">
                  {paying ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Processing...</span></> : <span>Pay KES {payAmount}</span>}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AIAssistant;
