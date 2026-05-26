import React, { useState, useEffect } from "react";
import { Zap, Activity, Info, RotateCcw } from "lucide-react";

interface SynapseSimulatorProps {
  onProgressUnlock: (topicId: string, percentage: number) => void;
  onShowNudge: (message: string) => void;
}

export default function SynapseSimulator({ onProgressUnlock, onShowNudge }: SynapseSimulatorProps) {
  const [step, setStep] = useState<"idle" | "impulse" | "release" | "binding" | "completed">("idle");
  const [neurotransmitters, setNeurotransmitters] = useState<Array<{ id: number; x: number; y: number; bound: boolean }>>([]);
  const [voltagePoints, setVoltagePoints] = useState<number[]>([10, 10, 10, 10, 10, 10]);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (step === "idle") {
      setNeurotransmitters([]);
      setVoltagePoints(Array(15).fill(-70));
    }
  }, [step]);

  // Handle action potential step transitions
  const triggerImpulse = () => {
    if (step !== "idle") return;
    setStep("impulse");
    
    // Simulate current wave in voltage graphs
    let frame = 0;
    const interval = setInterval(() => {
      setVoltagePoints(prev => {
        const next = [...prev];
        next.shift();
        let value = -70;
        if (frame >= 2 && frame < 7) {
          value = +40; // Action potential spike
        } else if (frame >= 7 && frame < 11) {
          value = -85; // Hyperpolarization
        }
        next.push(value);
        return next;
      });
      frame++;
      if (frame >= 14) clearInterval(interval);
    }, 100);

    // Release neurotransmitters next
    setTimeout(() => {
      setStep("release");
      // Populate 12 neurotransmitters with random offsets
      const transmitters = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: 140, // Left axon terminal boundary
        y: 100 + (Math.random() * 80 - 40),
        bound: false
      }));
      setNeurotransmitters(transmitters);

      // Diffuse across synaptic cleft
      setTimeout(() => {
        setStep("binding");
        setNeurotransmitters(prev =>
          prev.map((t, idx) => ({
            ...t,
            x: 230 + (Math.random() * 20 - 10), // Post synaptic receptor boundary
            bound: idx % 2 === 0 // 50% bind to receptors
          }))
        );

        // Depolarize post-synaptic side and complete sinapsis
        setTimeout(() => {
          setStep("completed");
          onProgressUnlock("sistema_nervioso", 100);
          onShowNudge("¡Genial! Has completado el simulador de sinapsis química. La señal ha pasado exitosamente de la neurona presináptica a la postsináptica.");
        }, 1200);

      }, 1000);

    }, 1500);

  };

  const resetSimulator = () => {
    setStep("idle");
  };

  return (
    <div className="bg-white rounded-[40px] border-4 border-emerald-100 p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="bg-neuro-100 text-neuro-700 text-xs font-semibold uppercase px-3 py-1 rounded-full">
            Laboratorio Virtual: Neurona
          </span>
          <h2 className="title-font text-2xl font-bold mt-2 text-slate-800">
            Simulador de Sinapsis Química
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Produce un impulso eléctrico y mira cómo cruza la brecha a través de neurotransmisores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition text-sm font-medium"
          >
            <Info className="w-4 h-4 text-neuro-500" />
            {showExplanation ? "Ocultar Explicación" : "Ver Leyenda"}
          </button>
          {step === "completed" && (
            <button
              onClick={resetSimulator}
              className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </button>
          )}
        </div>
      </div>

      {showExplanation && (
        <div className="bg-neuro-50 rounded-xl p-4 text-xs text-neuro-900 border border-neuro-100 mb-6 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold mb-1">💡 Elementos en pantalla:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong className="text-indigo-600">Axón Terminal (Izquierda)</strong>: Envía la información. Contiene vesículas con neurotransmisores.</li>
              <li><strong className="text-emerald-600">Espacio Sináptico (Centro)</strong>: Brecha física que separa ambas neuronas.</li>
              <li><strong className="text-orange-600">Dendrita Receptora (Derecha)</strong>: Recibe la señal mediante receptores de membrana.</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">🌱 Conexión Rural:</p>
            <p>
              ¡Piensa en esto como lanzar un balón (neurotransmisor) a través de un cañón pequeño para que otra persona al otro lado lo atrape. Una vez recopilados suficientes balones, se corre a avisar al próximo vecino!
            </p>
          </div>
        </div>
      )}

      {/* Simulator canvas */}
      <div className="relative border border-slate-100 rounded-xl bg-slate-900 h-64 overflow-hidden mb-6 flex items-center justify-between p-4 px-12">
        
        {/* Connection Background Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 border-t border-dashed border-slate-700 pointer-events-none z-0"></div>

        {/* --- LEFT SIDE: Pre-synaptic Neuron Terminal --- */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-center mb-1 text-[11px] font-semibold tracking-wider text-slate-400 capitalize">
            Neurona Presináptica
          </div>
          <div className="w-28 h-36 bg-slate-800 rounded-r-3xl border-2 border-indigo-400 flex items-center justify-center relative shadow-lg">
            
            {/* Action Potential shock animation */}
            {step === "impulse" && (
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center gap-1 z-20">
                <Zap className="w-8 h-8 text-yellow-300 animate-bounce" />
                <span className="bg-yellow-400 text-slate-950 font-bold text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                  +40mV
                </span>
              </div>
            )}

            {/* Neurotransmitter Vesicles inside terminal */}
            <div className="flex flex-col gap-3">
              <div className={`w-8 h-8 rounded-full border border-indigo-300 flex items-center justify-center p-0.5 ${step === "release" ? "scale-90 opacity-40 transition-all duration-700" : ""}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></div>
              </div>
              <div className={`w-8 h-8 rounded-full border border-indigo-300 flex items-center justify-center p-0.5 ${step === "release" ? "scale-90 opacity-40 transition-all duration-700" : ""}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></div>
              </div>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-indigo-500 w-2 h-12 rounded-l"></div>
          </div>
          <div className="text-[10px] text-indigo-300 mt-2 font-mono">Terminal Axónica</div>
        </div>

        {/* --- CENTER: Synaptic Cleft (Chemical messages) --- */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          {neurotransmitters.map((t) => (
            <div
              key={t.id}
              className={`absolute w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-md flex items-center justify-center transition-all duration-1000 border border-white`}
              style={{
                left: `${t.x}px`,
                top: `${t.y}px`,
                transform: "translate(-50%, -50%)"
              }}
            >
              <span className="text-[6px] text-slate-900 font-extrabold font-mono">NT</span>
            </div>
          ))}

          {step === "release" && (
            <div className="absolute bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 text-[9px] px-2 py-0.5 rounded font-mono top-4 animate-pulse">
              DIFUSIÓN DE NEUROTRANSMISORES
            </div>
          )}
        </div>

        {/* --- RIGHT SIDE: Post-synaptic Neuron Dendrite --- */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-center mb-1 text-[11px] font-semibold tracking-wider text-slate-400 capitalize">
            Neurona Postsináptica
          </div>
          <div className="w-28 h-36 bg-slate-800 rounded-l-3xl border-2 border-orange-400 flex flex-col justify-around py-4 pl-3 relative shadow-lg">
            
            {/* Receptors */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1.5">
                <div className={`w-3.5 h-5 rounded-r border border-orange-300 transition-colors ${step === "binding" || step === "completed" ? "bg-emerald-500 border-emerald-200" : "bg-slate-700"}`}></div>
                <span className="text-[8px] text-slate-400">Receptor D1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-3.5 h-5 rounded-r border border-orange-300 transition-colors ${step === "binding" || step === "completed" ? "bg-emerald-500 border-emerald-200" : "bg-slate-700"}`}></div>
                <span className="text-[8px] text-slate-400">Receptor D2</span>
              </div>
            </div>

            {step === "completed" && (
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 z-20">
                <Activity className="w-8 h-8 text-emerald-400 animate-pulse" />
                <span className="bg-emerald-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider text-center">
                  ¡Logrado!
                </span>
              </div>
            )}
          </div>
          <div className="text-[10px] text-orange-300 mt-2 font-mono">Dendrita</div>
        </div>

      </div>

      {/* Simulator Actions & Feedback metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        
        {/* Impulse Control Button */}
        <div className="lg:col-span-1">
          {step === "idle" ? (
            <button
              onClick={triggerImpulse}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-neuro-600 to-indigo-600 hover:from-neuro-700 hover:to-indigo-700 text-white font-semibold px-4 py-3.5 rounded-xl shadow-md cursor-pointer transition active:scale-95"
            >
              <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
              Disparar Impulso Eléctrico
            </button>
          ) : (
            <div className="w-full h-14 border border-slate-200 bg-slate-50 text-slate-500 font-medium rounded-xl flex items-center justify-center gap-2">
              <Activity className="w-5 h-5 text-neuro-500 animate-spin" />
              <span>Simulando...</span>
            </div>
          )}
        </div>

        {/* State meter */}
        <div className="lg:col-span-1 flex flex-col bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
          <span className="text-xs text-slate-500 font-medium">Estado del Proceso</span>
          <span className="text-md font-bold mt-1 uppercase text-slate-700 tracking-wider">
            {step === "idle" && "🔵 Listo para estimular"}
            {step === "impulse" && "⚡ Acción de Potencial"}
            {step === "release" && "🧪 Liberando neurotransmisor"}
            {step === "binding" && "🔒 Acoplamiento de Receptores"}
            {step === "completed" && "🟢 ¡Sinapsis Química Exitosa!"}
          </span>
        </div>

        {/* Graph representation of membrane potential */}
        <div className="lg:col-span-1 border border-slate-100 bg-slate-50 rounded-xl p-3 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-slate-500 font-mono">Potencial de Membrana</span>
            <span className="text-[10px] font-mono text-indigo-600 font-bold">
              {step === "completed" ? "Ubral superado (+40mV)" : "-70mV (Reposo)"}
            </span>
          </div>
          {/* Simple SVG Sparkline chart representing membrane potential */}
          <div className="h-10 bg-white border border-slate-200 rounded p-1 flex items-end justify-between overflow-hidden">
            {voltagePoints.map((v, i) => {
              // Map -90 to +50 onto a pixel height of 5 to 35
              const h = Math.max(4, Math.min(36, ((v + 90) / 140) * 32));
              return (
                <div
                  key={i}
                  className={`w-1.5 transition-all duration-300 rounded-t ${step === "completed" ? "bg-emerald-500" : "bg-indigo-500"}`}
                  style={{ height: `${h}px` }}
                ></div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
