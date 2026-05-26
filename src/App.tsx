import React, { useState, useEffect } from "react";
import {
  Brain, Zap, Map, Dna, Award, Send, BookOpen, Compass, HelpCircle,
  Volume2, VolumeX, Upload, Sparkles, School, Clock, ArrowRight, Info,
  CheckCircle, AlertCircle, Activity, User, Settings, LogOut, X, RefreshCw
} from "lucide-react";

import { Message, TopicProgress, Achievement, ActiveTab, UserProfile } from "./types";
import { INITIAL_TOPICS, INITIAL_ACHIEVEMENTS } from "./data";

// Custom Subcomponents
import LoginScreen from "./components/LoginScreen";
import FloatingChat from "./components/FloatingChat";
import ThreeDModels from "./components/ThreeDModels";
import ConceptualizationModule from "./components/ConceptualizationModule";
import ActivitiesModule from "./components/ActivitiesModule";

// Existing Virtual Simulators
import SynapseSimulator from "./components/SynapseSimulator";
import BrainLobesSimulator from "./components/BrainLobesSimulator";
import ProteinSynthesisSimulator from "./components/ProteinSynthesisSimulator";

export default function App() {
  // Authentication & Profile States
  const [userSession, setUserSession] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("neurobio_current_user");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>("inicio");
  const [activeSimTab, setActiveSimTab] = useState<"synapse" | "lobes" | "synthesis">("synapse");
  
  // Socratic Floating Chat toggle state
  const [isFloatChatOpen, setIsFloatChatOpen] = useState(false);

  const [topics, setTopics] = useState<TopicProgress[]>(() => {
    const saved = localStorage.getItem("neurobio_topics");
    return saved ? JSON.parse(saved) : INITIAL_TOPICS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem("neurobio_achievements");
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  // Notifications and Voices accessibility options
  const [showNudge, setShowNudge] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Evidence Modals
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceText, setEvidenceText] = useState("");
  const [evidenceTopic, setEvidenceTopic] = useState("sistema_nervioso");

  // Save changes to local caches
  useEffect(() => {
    localStorage.setItem("neurobio_topics", JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem("neurobio_achievements", JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    if (userSession) {
      localStorage.setItem("neurobio_current_user", JSON.stringify(userSession));
      localStorage.setItem(`user_profile_${userSession.username}`, JSON.stringify(userSession));
    }
  }, [userSession]);

  useEffect(() => {
    // Try auto logging in if remembered session is true
    if (!userSession) {
      const rememberedUsername = localStorage.getItem("neurobio_remembered_username");
      if (rememberedUsername) {
        const savedProfileStr = localStorage.getItem(`user_profile_${rememberedUsername}`);
        if (savedProfileStr) {
          try {
            const parsed = JSON.parse(savedProfileStr) as UserProfile;
            setUserSession(parsed);
          } catch (e) {
            console.error("Auto login error", e);
          }
        }
      }
    }
  }, []);

  // Sync speak cancel
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Global Progress metrics
  const totalPercentage = Math.round(
    topics.reduce((acc, curr) => acc + curr.percentage, 0) / topics.length
  );

  const levelName = 
    totalPercentage >= 90 ? "Neuro-Maestro V" :
    totalPercentage >= 70 ? "Bio-Científico IV" :
    totalPercentage >= 50 ? "Bio-Explorador III" :
    totalPercentage >= 25 ? "Bio-Novato II" : "Bio-Aspirante I";

  // Actions trigger: unlock achievement badge
  const unlockAchievement = (id: string, customTitle?: string) => {
    setAchievements(prev =>
      prev.map(item => {
        if (item.id === id && !item.unlocked) {
          const actualTitle = customTitle || item.title;
          triggerSoundSignal("success");
          setShowNudge(`🏆 ¡Nueva Insignia Escolar! "${actualTitle}"`);
          return { ...item, unlocked: true, unlockedAt: new Date().toISOString().split("T")[0] };
        }
        return item;
      })
    );
  };

  // Callback when a simulator yields progress
  const handleProgressUnlock = (topicId: string, percentage: number) => {
    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const updatedPercent = Math.max(t.percentage, percentage);
          return { ...t, percentage: updatedPercent };
        }
        return t;
      })
    );

    // Auto rewards based on completions
    if (topicId === "sistema_nervioso" && percentage === 100) {
      unlockAchievement("sn_iniciado");
      earnXPPoints(100);
    }
    if (topicId === "lobulos" && percentage === 100) {
      unlockAchievement("lobulo_explorado");
      earnXPPoints(100);
    }
    if (topicId === "proteinas" && percentage === 100) {
      unlockAchievement("sintesis_exitosa");
      earnXPPoints(100);
    }
  };

  const earnXPPoints = (points: number) => {
    if (!userSession) return;
    triggerSoundSignal("xp");
    setUserSession(prev => {
      if (!prev) return null;
      return { ...prev, xpPoints: prev.xpPoints + points };
    });
    setShowNudge(`✨ ¡Ganaste +${points} XP en tu bitácora!`);
  };

  // Text to speech for accessibility on rural schools
  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      setShowNudge("⚠️ Tu navegador no soporta sintetización de voz parlante.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strips markdown symbols
    const cleanText = text
      .replace(/\*\*|__/g, "")
      .replace(/\n/g, ". ")
      .replace(/[#*`_]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "es-ES";
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Play audio system beeps using pure Web Audio API (perfect for offline rural schools!)
  const triggerSoundSignal = (type: "success" | "xp" | "click") => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "success") {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.12); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.24); // G5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.38);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.4);
      } else if (type === "xp") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.32);
      } else {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.1);
      }
    } catch (e) {
      console.error("Web Audio API not supported relative to current browser sandbox.");
    }
  };

  // Evidence Form submit
  const handleSubmitEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceText.trim()) return;

    // Simulate socratic validation response
    triggerSoundSignal("success");
    earnXPPoints(50);
    unlockAchievement("metacognitivo_estrella");
    
    setShowEvidenceModal(false);
    setEvidenceText("");
    setShowNudge("📝 ¡Evidencia de aprendizaje consolidada! Tu tutor local la ha sellado.");
  };

  const handleLogout = () => {
    // Clear session and redirect to auth
    localStorage.removeItem("neurobio_current_user");
    setUserSession(null);
    setActiveTab("inicio");
  };

  const handleDeleteAllUserData = () => {
    if (confirm("¿Estás seguro de que quieres borrar tu progreso y cuentas? Esto reiniciará la base local.")) {
      localStorage.clear();
      setUserSession(null);
      setTopics(INITIAL_TOPICS);
      setAchievements(INITIAL_ACHIEVEMENTS);
      setActiveTab("inicio");
      alert("Cachés y puntajes destruidos.");
    }
  };

  // Rendering screen based on login session
  if (!userSession) {
    return (
      <LoginScreen
        onLoginSuccess={(profile) => {
          setUserSession(profile);
          triggerSoundSignal("success");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased text-slate-700 pb-12">
      
      {/* GLOBAL NUDGE POPUP TOAST */}
      {showNudge && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white border-2 border-slate-755 p-4.5 rounded-[24px] shadow-2xl flex items-center justify-between gap-4 max-w-sm animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <p className="text-xs font-black tracking-wide leading-tight">{showNudge}</p>
          </div>
          <button
            onClick={() => setShowNudge(null)}
            className="text-slate-400 hover:text-white font-bold ml-1 text-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HEADER STATUS BAR */}
      <header className="bg-white border-b-4 border-emerald-100 py-5 px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-md">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-black text-emerald-600 tracking-tight leading-none">
                  NeuroBio<span className="text-orange-500">IA</span>
                </h1>
                <span className="bg-emerald-50 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-100">
                  IE El Minuto de Dios
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-extrabold mt-1 uppercase tracking-wider">
                "Aprende biología explorando y descubriendo"
              </p>
            </div>
          </div>

          {/* Quick Profile stats */}
          <div className="flex items-center gap-4">
            
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-2.5 px-4 rounded-2xl">
              <div className="w-9 h-9 bg-orange-100 border border-orange-200 rounded-xl flex items-center justify-center text-orange-600 font-black text-xs select-none shadow-sm">
                {userSession.avatarInitials}
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-[11px] text-slate-800 leading-none">{userSession.fullName}</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1">
                  Grado {userSession.grade}° {userSession.course}
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-2.5 px-4 rounded-2xl flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
              <div className="text-left leading-none">
                <span className="block text-[10px] font-black text-amber-800 uppercase tracking-wide">Puntos XP</span>
                <span className="text-xs font-black text-slate-800 block mt-1">{userSession.xpPoints} XP</span>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* DASHBOARD CORE CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        
        {/* SIDEBAR NAVIGATION COLUMN */}
        <aside className="lg:col-span-3 flex flex-col gap-4">
          
          <div className="bg-white border-4 border-emerald-100 rounded-[30px] p-5 shadow space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Menú Navegador</h3>
            
            <nav className="space-y-1">
              <button
                onClick={() => { setActiveTab("inicio"); triggerSoundSignal("click"); }}
                className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "inicio" ? "bg-emerald-500 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>🏠</span>
                <span>Inicio / Dashboard</span>
              </button>
              
              <button
                onClick={() => { setActiveTab("conceptualizacion"); triggerSoundSignal("click"); }}
                className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "conceptualizacion" ? "bg-emerald-500 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>📘</span>
                <span>Conceptualización</span>
              </button>

              <button
                onClick={() => { setActiveTab("simulaciones"); triggerSoundSignal("click"); }}
                className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "simulaciones" ? "bg-emerald-500 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>🧪</span>
                <span>Simuladores</span>
              </button>

              <button
                onClick={() => { setActiveTab("modelos3d"); triggerSoundSignal("click"); }}
                className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "modelos3d" ? "bg-emerald-500 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>🧠</span>
                <span>Modelos 3D</span>
              </button>

              <button
                onClick={() => { setActiveTab("actividades"); triggerSoundSignal("click"); }}
                className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "actividades" ? "bg-emerald-500 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>📝</span>
                <span>Actividades guiadas</span>
              </button>

              <button
                onClick={() => { setActiveTab("progreso"); triggerSoundSignal("click"); }}
                className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "progreso" ? "bg-emerald-500 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>📊</span>
                <span>Mi progreso</span>
              </button>

              <button
                onClick={() => { setActiveTab("configuracion"); triggerSoundSignal("click"); }}
                className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "configuracion" ? "bg-emerald-500 text-white shadow-md" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>⚙️</span>
                <span>Configuración</span>
              </button>
            </nav>
          </div>

          {/* Quick Stats Summary Card */}
          <div className="bg-white border text-center border-slate-200 rounded-3xl p-5 shadow-sm space-y-3.5">
            <h4 className="text-[10px] font-black uppercase tracking-wide text-slate-400">Puntaje Biológico</h4>
            
            <div className="space-y-1">
              <span className="text-3xl font-black text-slate-800">{totalPercentage}%</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{levelName}</p>
            </div>

            {/* Dynamic visual progress gauge */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-150">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${totalPercentage}%` }}
              />
            </div>

            <button
              onClick={() => setShowEvidenceModal(true)}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase rounded-xl transition cursor-pointer flex items-center justify-center gap-1 border-2 border-white shadow-md"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Evidencia</span>
            </button>
          </div>

        </aside>

        {/* MAIN SCREEN INTERACTIVE ROUTER */}
        <main className="lg:col-span-9 flex flex-col gap-6">
          
          {/* VIEW 1: INICIO (Dashboard Overview with direct maps) */}
          {activeTab === "inicio" && (
            <div className="space-y-6">
              
              {/* Welcome banner */}
              <div className="relative rounded-[40px] overflow-hidden border-4 border-emerald-100 bg-slate-900 text-white p-6 min-h-[180px] flex flex-col justify-end shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10"></div>
                
                {/* Visual brain graphics */}
                <div className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-emerald-600/35 border border-emerald-400/40 flex items-center justify-center animate-ping"></div>

                <div className="relative z-20 space-y-2 text-left">
                  <span className="bg-orange-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest leading-none block w-max">
                    Bienvenido de vuelta
                  </span>
                  <h3 className="title-font font-black text-2xl text-white">¡Hola, {userSession.fullName}!</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                    Explora los modelos 3D interactivos, simula impulsos nerviosos en nuestros simuladores de laboratorio, o desafía tus metas ganando XP para subir de rango.
                  </p>
                </div>
              </div>

              {/* Quick Jump Modules grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="bg-white border-2 border-slate-150 rounded-3xl p-5 hover:border-emerald-400 transition cursor-pointer flex flex-col justify-between space-y-4" onClick={() => setActiveTab("conceptualizacion")}>
                  <div className="space-y-2">
                    <span className="text-2xl">📘</span>
                    <h4 className="font-extrabold text-xs text-slate-800">1. Conceptualización</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">Estudia el sistema nervioso, hemisferios cerebrales y síntesis proteica.</p>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span>Estudiar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="bg-white border-2 border-slate-150 rounded-3xl p-5 hover:border-emerald-400 transition cursor-pointer flex flex-col justify-between space-y-4" onClick={() => setActiveTab("simulaciones")}>
                  <div className="space-y-2">
                    <span className="text-2xl">🧪</span>
                    <h4 className="font-extrabold text-xs text-slate-800">2. laboratorios Simulación</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">Opera de forma lúdica las sinapsis, lóbulos y cadenas de traducción.</p>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span>Simular</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="bg-white border-2 border-slate-150 rounded-3xl p-5 hover:border-emerald-400 transition cursor-pointer flex flex-col justify-between space-y-4" onClick={() => setActiveTab("actividades")}>
                  <div className="space-y-2">
                    <span className="text-2xl">📝</span>
                    <h4 className="font-extrabold text-xs text-slate-800">3. Retos y Actividades</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">Gana puntos XP resolviendo diagnósticos, juegos dnd o casos reales clínicos.</p>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span>Entrenar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>

            </div>
          )}

          {/* VIEW 2: CONCEPTUALIZACIÓN (Módulo 1) */}
          {activeTab === "conceptualizacion" && (
            <ConceptualizationModule />
          )}

          {/* VIEW 3: SIMULADORES (Módulo 2) */}
          {activeTab === "simulaciones" && (
            <div className="flex flex-col gap-6">
              
              {/* Simulation switch sub-bar */}
              <div className="bg-white border border-slate-200 rounded-3xl p-2.5 shadow-sm flex gap-2">
                <button
                  onClick={() => { setActiveSimTab("synapse"); triggerSoundSignal("click"); }}
                  className={`flex-1 text-center py-2.5 text-xs font-black transition rounded-xl cursor-pointer ${
                    activeSimTab === "synapse" ? "bg-emerald-500 text-white shadow" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  ⚡ Sinapsis Neuronal
                </button>
                <button
                  onClick={() => { setActiveSimTab("lobes"); triggerSoundSignal("click"); }}
                  className={`flex-1 text-center py-2.5 text-xs font-black transition rounded-xl cursor-pointer ${
                    activeSimTab === "lobes" ? "bg-emerald-500 text-white shadow" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  📍 Lóbulos Cerebrales
                </button>
                <button
                  onClick={() => { setActiveSimTab("synthesis"); triggerSoundSignal("click"); }}
                  className={`flex-1 text-center py-2.5 text-xs font-black transition rounded-xl cursor-pointer ${
                    activeSimTab === "synthesis" ? "bg-emerald-500 text-white shadow" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  🧪 Síntesis Proteínas
                </button>
              </div>

              {activeSimTab === "synapse" && (
                <SynapseSimulator
                  onProgressUnlock={handleProgressUnlock}
                  onShowNudge={(msg) => setShowNudge(msg)}
                />
              )}

              {activeSimTab === "lobes" && (
                <BrainLobesSimulator
                  onProgressUnlock={handleProgressUnlock}
                  onShowNudge={(msg) => setShowNudge(msg)}
                />
              )}

              {activeSimTab === "synthesis" && (
                <ProteinSynthesisSimulator
                  onProgressUnlock={handleProgressUnlock}
                  onShowNudge={(msg) => setShowNudge(msg)}
                />
              )}

            </div>
          )}

          {/* VIEW 4: MODELOS 3D (Módulo 2) */}
          {activeTab === "modelos3d" && (
            <ThreeDModels />
          )}

          {/* VIEW 5: ACTIVIDADES (Módulo 3) */}
          {activeTab === "actividades" && (
            <ActivitiesModule
              xpPoints={userSession.xpPoints}
              onEarnXP={earnXPPoints}
              onUnlockBadge={(badgeId, title) => unlockAchievement(badgeId, title)}
            />
          )}

          {/* VIEW 6: MI PROGRESO */}
          {activeTab === "progreso" && (
            <div className="bg-white rounded-[40px] border-4 border-emerald-100 p-6 shadow-xl space-y-6">
              
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black uppercase px-3 py-1 rounded-full pl-2">
                  Bitácora de Saberes 🎖️
                </span>
                <h2 className="title-font text-2xl font-black text-slate-800 mt-2">
                  Progreso y Logros Académicos
                </h2>
                <p className="text-xs text-slate-500 font-medium italic mt-0.5">
                  Revisa tu porcentaje de aprendizaje y galería de insignias desbloqueadas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {topics.map((topic) => (
                  <div key={topic.id} className="border border-slate-150 rounded-2xl p-4.5 bg-slate-50/70 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-slate-800">{topic.title}</span>
                      <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">{topic.percentage}% Completo</span>
                    </div>

                    {/* Progress slider scale */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-500"
                        style={{ width: `${topic.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}

              </div>

              <div className="border-t border-dashed border-emerald-100 pt-4 space-y-3.5">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wide">Insignias recolectadas:</h3>

                <div className="space-y-2.5">
                  {achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className={`p-4 rounded-3xl border-2 flex items-center gap-4 transition-all ${
                        ach.unlocked
                          ? "bg-white border-orange-200 shadow-md animate-in zoom-in-95"
                          : "bg-slate-50/85 border-slate-150 opacity-55"
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border-2 ${
                        ach.unlocked
                          ? "bg-orange-100 border-orange-300 text-orange-600"
                          : "bg-slate-100 border-slate-200 text-slate-300"
                      }`}>
                        {ach.id === "sn_iniciado" && <Zap className="w-5 h-5 animate-pulse" />}
                        {ach.id === "hemisferios_completos" && <Brain className="w-5 h-5" />}
                        {ach.id === "lobulo_explorado" && <Map className="w-5 h-5" />}
                        {ach.id === "sintesis_exitosa" && <Dna className="w-5 h-5" />}
                        {ach.id === "metacognitivo_estrella" && <Award className="w-5 h-5" />}
                        {!["sn_iniciado", "hemisferios_completos", "lobulo_explorado", "sintesis_exitosa", "metacognitivo_estrella"].includes(ach.id) && <Award className="w-5 h-5" />}
                      </div>

                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-black text-xs text-slate-800">{ach.title}</h4>
                          {ach.unlocked ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase scale-90">Desbloqueado</span>
                          ) : (
                            <span className="bg-slate-200 text-slate-500 text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase scale-90">Bloqueado</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-semibold">{ach.description}</p>
                        {ach.unlockedAt && (
                          <span className="text-[8px] text-slate-400 block mt-1 font-mono">Conseguido: {ach.unlockedAt}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* VIEW 7: CONFIGURACIÓN */}
          {activeTab === "configuracion" && (
            <div className="bg-white rounded-[40px] border-4 border-emerald-100 p-6 shadow-xl space-y-6">
              
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black uppercase px-3 py-1 rounded-full pl-2">
                  Gestión Escolar ⚙️
                </span>
                <h2 className="title-font text-2xl font-black text-slate-800 mt-2">
                  Ajustes y Parámetros del Perfil
                </h2>
                <p className="text-xs text-slate-500 font-medium italic mt-0.5">
                  Ajusta tus parámetros, haz pruebas sonoras y controla tu caché escolar local.
                </p>
              </div>

              {/* Setting details form block */}
              <div className="space-y-4 max-w-md">
                
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-651 uppercase">Nombre completo de estudiante:</label>
                  <input
                    type="text"
                    value={userSession.fullName}
                    onChange={(e) => setUserSession({ ...userSession, fullName: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-xs px-3.5 py-2.5 rounded-2xl text-slate-800 font-extrabold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-651 uppercase">Grado asignado:</label>
                    <select
                      value={userSession.grade}
                      onChange={(e) => setUserSession({ ...userSession, grade: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-200 text-xs px-3.5 py-2.5 rounded-2xl text-slate-800 font-black"
                    >
                      <option value="6">6° Primaria</option>
                      <option value="7">7° Secundaria</option>
                      <option value="8">8° Secundaria</option>
                      <option value="9">9° Secundaria</option>
                      <option value="10">10° Media</option>
                      <option value="11">11° Media</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-651 uppercase">Grupo o grupo:</label>
                    <select
                      value={userSession.course}
                      onChange={(e) => setUserSession({ ...userSession, course: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-200 text-xs px-3.5 py-2.5 rounded-2xl text-slate-800 font-black"
                    >
                      <option value="A">Grupo A</option>
                      <option value="B">Grupo B</option>
                      <option value="C">Grupo C</option>
                      <option value="D">Grupo D</option>
                    </select>
                  </div>
                </div>

                {/* Sound effect tester sliders */}
                <div className="pt-2">
                  <span className="text-xs font-black text-slate-651 uppercase block mb-2">Accesos sonoros y voz:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`px-3 py-2 text-[10px] rounded-xl font-bold border transition cursor-pointer ${
                        soundEnabled ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-400 border-slate-200"
                      }`}
                    >
                      {soundEnabled ? "🔊 Efectos activados" : "🔇 Efectos mudos"}
                    </button>
                    
                    <button
                      onClick={() => { triggerSoundSignal("success"); speakText("Prueba de sonido de tu acompañante NeuroBioIA."); }}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] uppercase font-bold rounded-xl transition cursor-pointer"
                    >
                      🔊 Probar Voz Tutor
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-slate-200 space-y-2">
                  <span className="text-xs font-black text-slate-651 uppercase block">Acciones críticas:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-800 border-2 border-red-200 text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>

                    <button
                      onClick={handleDeleteAllUserData}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-250 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Reiniciar progresos locales
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>

      </div>

      {/* FLOATING ACTION TRIGGER COMPANION FOR IA CHAT */}
      <button
        onClick={() => { setIsFloatChatOpen(!isFloatChatOpen); triggerSoundSignal("click"); }}
        style={{ filter: "drop-shadow(0px 8px 24px rgba(16,185,129,0.45))" }}
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 border-3 border-white text-white p-4.5 rounded-full flex items-center justify-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Brain className="w-6 h-6 animate-pulse" />
        <span className="text-xs font-black tracking-wider uppercase pr-1.5 font-mono">
          💬🧠 conectar con IA
        </span>
      </button>

      {/* FLOAT CONVERSATIONAL BOX PANEL ASSISTANT */}
      <FloatingChat
        isOpen={isFloatChatOpen}
        onClose={() => setIsFloatChatOpen(false)}
        speakText={speakText}
        isSpeaking={isSpeaking}
        fullName={userSession.fullName}
      />

      {/* PERSISTENT EDUCATIONAL FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 mt-12 text-center text-[10px] text-slate-400 border-t border-slate-150 pt-6">
        <p>© 2026 NeuroBioIA. Diseñado bimodalmente para el fomento educativo en Institución Educativa El Minuto de Dios (Sede Los Córdobas).</p>
        <p className="mt-1">Licencia de Código Libre Apache-2.0 • Rural Educational Network.</p>
      </footer>

      {/* INTERACTIVE SUBIR EVIDENCIA MODAL */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 shadow-2xl relative border-4 border-emerald-100 animate-in zoom-in-95">
            <button
              onClick={() => setShowEvidenceModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5 font-black" />
            </button>

            <h3 className="title-font font-black text-lg text-slate-800 mb-2 flex items-center gap-1.5">
              <Upload className="w-5 h-5 text-emerald-600" />
              Subir Evidencia de Aprendizaje
            </h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed font-semibold">
              Escribe en tus propias palabras un resumen o hipótesis sobre lo que has comprendido del tema en tu cartilla. Tu tutor NeuroBioIA evaluará tu respuesta para retroalimentarte constructivamente, ayudando a consolidar tu progreso.
            </p>

            <form onSubmit={handleSubmitEvidence} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">
                  Selecciona el tema de la actividad escuelera:
                </label>
                <select
                  value={evidenceTopic}
                  onChange={(e) => setEvidenceTopic(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-xs p-3 rounded-xl focus:outline-none text-slate-700 font-bold"
                >
                  <option value="sistema_nervioso">Sistema Nervioso / Sinapsis</option>
                  <option value="hemisferios">Hemisferios Cerebrales</option>
                  <option value="lobulos">Lóbulos de la Corteza</option>
                  <option value="proteinas">Síntesis de Proteínas / Traducción</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">
                  Escribe tu texto, hipótesis o explicación (Tu Evidencia):
                </label>
                <textarea
                  value={evidenceText}
                  onChange={(e) => setEvidenceText(e.target.value)}
                  required
                  rows={4}
                  placeholder="Por ejemplo: 'Las neuronas se comunican sin tocarse liberando neurotransmisores. La mielina protege al axón como el caucho cuida la corriente...'"
                  className="w-full bg-slate-50 border-2 border-slate-200 text-xs p-3.5 rounded-xl focus:outline-none focus:bg-white text-slate-800 font-semibold"
                />
              </div>

              <div className="flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => setShowEvidenceModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-105 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md border border-white"
                >
                  Enviar Evidencia a NeuroBioIA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
