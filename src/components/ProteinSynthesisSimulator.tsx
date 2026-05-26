import React, { useState } from "react";
import { Dna, HelpCircle, CheckCircle, Flame, ArrowRight, RotateCcw } from "lucide-react";

interface ProteinSynthesisSimulatorProps {
  onProgressUnlock: (topicId: string, percentage: number) => void;
  onShowNudge: (message: string) => void;
}

interface CodonItem {
  codon: string;
  anticodon: string;
  aminoacid: string;
}

const CODON_STEPS: CodonItem[] = [
  { codon: "AUG", anticodon: "UAC", aminoacid: "Metionina (Met-Inicio)" },
  { codon: "UUU", anticodon: "AAA", aminoacid: "Fenilalanina (Phe)" },
  { codon: "GGG", anticodon: "CCC", aminoacid: "Glicina (Gly)" },
  { codon: "ACC", anticodon: "UGG", aminoacid: "Treonina (Thr)" }
];

export default function ProteinSynthesisSimulator({ onProgressUnlock, onShowNudge }: ProteinSynthesisSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [proteinsBuilt, setProteinsBuilt] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedAnticodon, setSelectedAnticodon] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  // Available options random list
  const tRnaOptions = [
    { anticodon: "AAA", aminoacid: "Fenilalanina (Phe)", codonMatch: "UUU" },
    { anticodon: "UAC", aminoacid: "Metionina (Met-Inicio)", codonMatch: "AUG" },
    { anticodon: "UGG", aminoacid: "Treonina (Thr)", codonMatch: "ACC" },
    { anticodon: "CCC", aminoacid: "Glicina (Gly)", codonMatch: "GGG" },
    { anticodon: "CGA", aminoacid: "Alanina (Ala)", codonMatch: "GCU" }
  ];

  const handleSelectAnticodon = (anticodon: string) => {
    setSelectedAnticodon(anticodon);
    setFeedback(null);
  };

  const handleTranslate = () => {
    if (!selectedAnticodon) {
      setFeedback("⚠️ Por favor, selecciona un ARN de Transferencia (tRNA) primero.");
      return;
    }

    const currentTarget = CODON_STEPS[currentStep];

    if (selectedAnticodon === currentTarget.anticodon) {
      setFeedback(`✅ ¡Excelente! El anticodón ${selectedAnticodon} se acopló perfectamente al codón mRNA ${currentTarget.codon}.`);
      setProteinsBuilt(prev => [...prev, currentTarget.aminoacid]);
      
      const nextStep = currentStep + 1;
      
      if (nextStep < CODON_STEPS.length) {
        setTimeout(() => {
          setCurrentStep(nextStep);
          setSelectedAnticodon(null);
          setFeedback(null);
        }, 1500);
      } else {
        setTimeout(() => {
          setCompleted(true);
          onProgressUnlock("proteinas", 100);
          onShowNudge("¡Genial! Has traducido exitosamente toda la cadena de ARNm para sintetizar la proteína escolar peptídica.");
        }, 1500);
      }
    } else {
      setFeedback("❌ Las bases no se aparean. Recuerda: Adenina(A) con Uracilo(U), Citosina(C) con Guanina(G). Haz otra prueba.");
    }
  };

  const resetSimulator = () => {
    setCurrentStep(0);
    setProteinsBuilt([]);
    setSelectedAnticodon(null);
    setFeedback(null);
    setCompleted(false);
  };

  return (
    <div className="bg-white rounded-[40px] border-4 border-emerald-100 p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="bg-sky-100 text-sky-800 text-xs font-semibold uppercase px-3 py-1 rounded-full">
            Taller Biológico: Síntesis Celular
          </span>
          <h2 className="title-font text-2xl font-bold mt-2 text-slate-800">
            Fábrica de Síntesis de Proteínas
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Imita al Ribosoma celular acoplando los anticodones correctos de tRNA con el codon mRNA para tejer aminoácidos.
          </p>
        </div>
        {completed && (
          <button
            onClick={resetSimulator}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar Fábrica
          </button>
        )}
      </div>

      {/* Ribosome Animation Chamber */}
      <div className="border border-slate-100 bg-slate-950 rounded-2xl p-6 relative overflow-hidden mb-6 flex flex-col items-center">
        {/* DNA Recipe Room Indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-[10px] text-sky-300 font-mono">
          <Dna className="w-3.5 h-3.5 animate-pulse" />
          <span>Fase: Traducción (Ribosoma)</span>
        </div>

        {/* Dynamic Peptide Chain Display */}
        <div className="mt-8 flex items-center justify-center gap-2 flex-wrap min-h-[64px] border-b border-dashed border-slate-800 w-full pb-6 mb-6">
          <span className="text-[10px] text-slate-500 font-mono uppercase bg-slate-900 border border-slate-800 px-2 py-1 rounded mr-2">
            Peptído ➡️
          </span>
          {proteinsBuilt.length === 0 ? (
            <span className="text-xs text-slate-500 italic">No hay aminoácidos enlazados aún...</span>
          ) : (
            proteinsBuilt.map((aa, i) => (
              <React.Fragment key={i}>
                <div className="bg-sky-600 outline-2 outline-sky-400 text-white text-xs font-bold px-3 py-2 rounded-full shadow-md animate-bounce">
                  ✨ {aa}
                </div>
                {i < proteinsBuilt.length - 1 && <ArrowRight className="w-4 h-4 text-sky-450" />}
              </React.Fragment>
            ))
          )}
        </div>

        {/* The Ribosome chamber actively reading the mRNA */}
        {!completed ? (
          <div className="w-full max-w-lg flex flex-col items-center">
            
            {/* Active reading frame */}
            <div className="bg-slate-900 border-2 border-dashed border-sky-500/50 rounded-2xl p-5 w-full text-center relative mb-4">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                Codón Activo en Ribosoma
              </span>
              <div className="text-3xl font-extrabold text-sky-400 font-mono tracking-widest mt-2">
                {CODON_STEPS[currentStep].codon}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase font-mono">
                Paso {currentStep + 1} de {CODON_STEPS.length}
              </div>
            </div>

            {/* Custom Formula analogy */}
            <p className="text-center text-xs text-slate-400 italic max-w-md leading-relaxed mt-1">
              "Para leer el molde de {CODON_STEPS[currentStep].codon}, necesitamos el trío anticodón complementario exacto para liberar el {CODON_STEPS[currentStep].aminoacid}."
            </p>
          </div>
        ) : (
          <div className="text-center py-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white title-font">¡Proteína Completada con Éxito!</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
              Has traducido correctamente los 4 codones secuenciales obteniendo una cadena polipeptídica con Metionina, Fenilalanina, Glicina y Treonina.
            </p>
          </div>
        )}
      </div>

      {/* tRNA Options Selectors */}
      {!completed && (
        <div className="space-y-4">
          <span className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" />
            Selecciona el ARN de Transferencia (tRNA) complementario:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {tRnaOptions.map((opt) => (
              <button
                key={opt.anticodon}
                onClick={() => handleSelectAnticodon(opt.anticodon)}
                className={`py-3.5 px-2 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  selectedAnticodon === opt.anticodon
                    ? "bg-sky-50 border-sky-500 scale-105 shadow-md"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                {/* tRNA structure mockup */}
                <div className="w-7 h-10 border-2 border-sky-400 rounded-t-full flex items-end justify-center pb-1 mb-2 bg-sky-200/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-450 animate-ping"></div>
                </div>
                <span className="text-xs font-extrabold font-mono tracking-wide bg-slate-900 text-sky-400 px-1.5 py-0.5 rounded leading-none">
                  {opt.anticodon}
                </span>
                <span className="text-[9px] text-slate-400 block mt-2 leading-tight">
                  {opt.aminoacid.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-dashed border-slate-200">
            {feedback ? (
              <div className={`text-xs px-3.5 py-2.5 rounded-xl border text-slate-750 flex-1 leading-relaxed ${
                feedback.includes("✅") ? "bg-emerald-50 border-emerald-150" : "bg-amber-50 border-amber-150"
              }`}>
                {feedback}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex-1">
                Selecciona una clave de transferencia y toca "Acoplar Codón" para alimentar al ribosoma.
              </div>
            )}

            <button
              onClick={handleTranslate}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow cursor-pointer transition"
            >
              Acoplar Codón
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
