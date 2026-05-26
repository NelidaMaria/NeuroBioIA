import React, { useState, useEffect, useRef } from "react";
import { Message, TopicProgress } from "../types";
import { Send, Sparkles, Volume2, X, Brain, Loader2, RefreshCw } from "lucide-react";

interface FloatingChatProps {
  isOpen: boolean;
  onClose: () => void;
  speakText: (text: string) => void;
  isSpeaking: boolean;
  fullName: string;
}

export default function FloatingChat({ isOpen, onClose, speakText, isSpeaking, fullName }: FloatingChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-float",
      sender: "agent",
      text: `¡Hola **${fullName}**! Soy **NeuroBioIA** 🧠, tu tutor interactivo de Ciencias Naturales.\n\nEstaré flotando aquí mientras exploras los temas, realizas simulaciones o resuelves desafíos. Puedes preguntarme dudas, pedir pistas o que te explique las cosas con analogías del campo.\n\n¿Tienes alguna duda sobre el sistema nervioso, hemisferios cerebrales, lóbulos o la síntesis de proteínas? Escíbeme abajo.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `float-user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage("");
    setIsTyping(true);
    setErrorStatus("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(m => ({ role: m.sender === "user" ? "user" : "model", text: m.text }))
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [
          ...prev,
          {
            id: `float-agent-${Date.now()}`,
            sender: "agent",
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `float-err-${Date.now()}`,
            sender: "agent",
            text: `⚠️ **Aviso:** ${data.error || "No se ha podido comunicar con la IA."}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      }
    } catch (err) {
      setErrorStatus("Fallo de conexión");
      setMessages(prev => [
        ...prev,
        {
          id: `float-err-conn-${Date.now()}`,
          sender: "agent",
          text: `⚠️ **Error de conexión:** No se pudo conectar con el tutor NeuroBioIA. Por favor verifica los secretos escolares de la clave API.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const requestFloatHint = async () => {
    const lastUserAndAgent = [...messages].reverse();
    const lastContext = lastUserAndAgent.find(m => m.sender === "user")?.text || "el sistema nervioso cerebral";

    setIsTyping(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Dame una pista socrática corta o una analogía física de la vereda que se relacione con: ${lastContext}. No des la respuesta final, guíame a reflexionar.`
        })
      });
      const data = await response.json();
      if (data.success) {
        setMessages(prev => [
          ...prev,
          {
            id: `float-hint-${Date.now()}`,
            sender: "agent",
            text: `💡 **Pista Socrática:** ${data.text}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isHint: true
          }
        ]);
      }
    } catch (err) {
      console.error("Hint error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome-float-reset",
        sender: "agent",
        text: "¡Base restaurada! Soy tu acompañante de estudio NeuroBioIA. ¿Qué duda te gustaría que resolvamos juntos ahora? 🎓",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[550px] bg-white rounded-[32px] border-4 border-emerald-200 shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-350 overflow-hidden">
      
      {/* Header of Chat */}
      <div className="bg-emerald-500 text-white py-4 px-5 flex items-center justify-between border-b-2 border-emerald-300">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-[13px] tracking-wide leading-none text-white">Conexión NeuroBioIA</h3>
            <span className="text-[10px] text-emerald-100 italic font-medium">Tutor Virtual Escolar</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            title="Reiniciar chat"
            className="p-1 px-1.5 hover:bg-white/10 rounded-lg text-emerald-100 hover:text-white transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 px-1.5 hover:bg-white/10 rounded-lg text-emerald-100 hover:text-white transition cursor-pointer font-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message space */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70">
        {messages.map((m) => {
          const isAgent = m.sender === "agent";
          return (
            <div key={m.id} className={`flex flex-col ${isAgent ? "items-start" : "items-end"}`}>
              <div
                className={`text-[11px] p-3.5 rounded-[22px] max-w-[88%] leading-relaxed border shadow-sm ${
                  isAgent
                    ? m.isHint
                      ? "bg-amber-50 border-amber-200 text-slate-800 rounded-tl-none"
                      : "bg-white border-slate-100 text-slate-700 rounded-tl-none"
                    : "bg-emerald-500 text-white rounded-tr-none border-emerald-400"
                }`}
                style={{ whiteSpace: "pre-line" }}
              >
                {/* Parse key words simply */}
                {m.text.split("\n\n").map((para, pIdx) => (
                  <p key={pIdx} className="mb-1.5 last:mb-0">
                    {para.split("**").map((subText, subIdx) => {
                      if (subIdx % 2 === 1) {
                        return <strong key={subIdx} className="font-extrabold text-orange-600 bg-orange-50/20 px-0.5 rounded">{subText}</strong>;
                      }
                      return subText;
                    })}
                  </p>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[8px] text-slate-400 font-mono px-1">{m.timestamp}</span>
                {isAgent && (
                  <button
                    onClick={() => speakText(m.text)}
                    className="text-[8px] text-emerald-600 font-extrabold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Escuchar</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start">
            <div className="bg-emerald-50 border border-emerald-100 text-[11px] p-3 rounded-[16px] rounded-tl-none flex items-center gap-2 text-emerald-700 font-bold shadow-sm">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Pensando analogía rural...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested trigger pills */}
      <div className="p-3 bg-white border-t border-slate-100">
        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wide pl-1 block mb-1">Mejores preguntas:</span>
        <div className="flex flex-wrap gap-1.5 max-h-[75px] overflow-y-auto">
          <button
            onClick={() => handleSendMessage("Explícame la sinapsis con una analogía rural de caminos y entregas")}
            className="text-[9px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200 rounded-full px-2.5 py-1 transition cursor-pointer"
          >
            🌾 Sinapsis Rural
          </button>
          <button
            onClick={() => handleSendMessage("¿Por qué el lóbulo frontal es el director de orquesta de las decisiones del colegio?")}
            className="text-[9px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200 rounded-full px-2.5 py-1 transition cursor-pointer"
          >
            🧠 Lóbulo Frontal
          </button>
          <button
            onClick={() => handleSendMessage("¿De qué se encarga el cuerpo calloso y cómo une los dos hemisferios?")}
            className="text-[9px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200 rounded-full px-2.5 py-1 transition cursor-pointer"
          >
            🌁 Cuerpo Calloso
          </button>
          <button
            onClick={() => handleSendMessage("Hazme un resumen rápido sobre cómo ARN copia ADN en la transcripción proteica")}
            className="text-[9px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200 rounded-full px-2.5 py-1 transition cursor-pointer"
          >
            🧪 Transcripción ADN
          </button>
        </div>
      </div>

      {/* Input panel block */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Dile algo a la IA o pide aclaraciones..."
            className="flex-1 bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-450 text-slate-800 font-bold"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isTyping}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white p-2.5 px-3 rounded-xl cursor-pointer transition flex items-center justify-center shadow-md border border-white"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={requestFloatHint}
            title="Pedir pista reflexiva"
            className="flex items-center gap-1 px-3 py-1 bg-amber-100 hover:bg-amber-200 border border-amber-250 text-amber-800 rounded-full transition text-[9px] font-black cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Pista Socrática ✨</span>
          </button>
          <span className="text-[8px] text-slate-400">Verifica saberes con tu docente.</span>
        </div>
      </div>

    </div>
  );
}
