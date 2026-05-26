import React, { useState } from "react";
import { Brain, MapPin, Eye, Volume2, HelpCircle, CheckCircle, AlertCircle } from "lucide-react";

interface BrainLobesSimulatorProps {
  onProgressUnlock: (topicId: string, percentage: number) => void;
  onShowNudge: (message: string) => void;
}

interface LobeInfo {
  id: string;
  name: string;
  color: string;
  activeColor: string;
  coords: string; // for display coordinates description
  role: string;
  analogy: string;
  scenario: {
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const LOBES_DATA: LobeInfo[] = [
  {
    id: "frontal",
    name: "Lóbulo Frontal",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    activeColor: "bg-blue-600 text-white border-blue-800 focus:ring-blue-300",
    coords: "Parte delantera de la cabeza (frente)",
    role: "Planificación de metas, toma de decisiones correctas, control de movimientos musculares voluntarios y expresión de la personalidad.",
    analogy: "El Rector o Director de la escuela, quien planifica las clases, decide qué se hace al día y supervisa el orden.",
    scenario: {
      text: "Un campesino experimenta un cambio drástico de personalidad e incapacidad absoluta para planificar sus recorridos o sembrar a tiempo tras un leve golpe frontal. ¿Qué lóbulo sufrió el daño?",
      options: [
        "El Lóbulo Occipital que rige la visión.",
        "El Lóbulo Frontal encargado de la personalidad y planificación.",
        "El Lóbulo Temporal responsable de la música."
      ],
      correctIndex: 1,
      explanation: "El Lóbulo Frontal es responsable de coordinar las funciones ejecutivas: planificar, tomar decisiones maduras, autocontrolar los impulsos y moldear nuestra personalidad activa."
    }
  },
  {
    id: "parietal",
    name: "Lóbulo Parietal",
    color: "bg-orange-100 text-orange-800 border-orange-300",
    activeColor: "bg-orange-600 text-white border-orange-850 focus:ring-orange-300",
    coords: "Parte superior y trasera de la cabeza",
    role: "Procesa las sensaciones físicas del tacto: sentir el viento frío, el calor del fogón de leña, la presión y detectar dolores del cuerpo.",
    analogy: "Un estudiante alerta que siente inmediatamente la temperatura fría del pupitre de metal o la textura rugosa de la tiza escolar.",
    scenario: {
      text: "Inés toca una olla de barro con chocolate caliente y retira la mano de inmediato porque su corteza sintió el calor abrasador. ¿Qué lóbulo procesó esa sensación de temperatura?",
      options: [
        "Lóbulo Occipital.",
        "Lóbulo Temporal.",
        "Lóbulo Parietal."
      ],
      correctIndex: 2,
      explanation: "El Lóbulo Parietal procesa la información sensorial de temperatura, tacto, dolor y presión de todas las partes del cuerpo humano."
    }
  },
  {
    id: "temporal",
    name: "Lóbulo Temporal",
    color: "bg-pink-100 text-pink-800 border-pink-300",
    activeColor: "bg-pink-600 text-white border-pink-850 focus:ring-pink-300",
    coords: "Cerca de las sienes/orejas",
    role: "Involucrado con la audición, el procesamiento y comprensión de palabras, memoria y reconocimiento de rostros conocidos.",
    analogy: "El guardián de la memoria de la comunidad rural, que recuerda todas las coplas tradicionales, historias familiares y reconoce quién canta a lo lejos.",
    scenario: {
      text: "Un ex-profesor de la escuela rural escucha el canto y las risas de sus ex-alumnos, y puede comprender cada palabra a la perfección. ¿Qué lóbulo procesa los ruidos y el lenguaje escuchado?",
      options: [
        "El Lóbulo Temporal.",
        "El Lóbulo Frontal.",
        "El Lóbulo Occipital."
      ],
      correctIndex: 0,
      explanation: "El Lóbulo Temporal alberga la corteza auditiva primaria y zonas avanzadas como el Área de Wernicke para comprender el idioma que escuchamos."
    }
  },
  {
    id: "occipital",
    name: "Lóbulo Occipital",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    activeColor: "bg-emerald-600 text-white border-emerald-850 focus:ring-emerald-350",
    coords: "Zona de la nuca (atrás)",
    role: "Encargado exclusivo de recibir y decodificar los impulsos visuales: formas de árboles, colores, rostros y distancias de animales.",
    analogy: "La pantalla de televisión o proyector multimedia de la escuela, que recibe las imágenes brutas y las muestra con detalle.",
    scenario: {
      text: "Tras mirar un arcoíris en el cielo sobre El Minuto de Dios, un estudiante describe asombrado los siete colores. ¿Qué lóbulo de su cortex resolvió las ondas electromagnéticas visuales?",
      options: [
        "El Lóbulo Frontal de la personalidad.",
        "El Lóbulo Occipital de la visión.",
        "El Lóbulo Temporal de la acústica."
      ],
      correctIndex: 1,
      explanation: "Toda la información visual captada por las retinas viaja directamente hacia el Lóbulo Occipital en el polo posterior del cerebro para ser procesada."
    }
  }
];

export default function BrainLobesSimulator({ onProgressUnlock, onShowNudge }: BrainLobesSimulatorProps) {
  const [selectedLobe, setSelectedLobe] = useState<LobeInfo>(LOBES_DATA[0]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [validated, setValidated] = useState<Record<string, "correct" | "incorrect" | null>>({});

  const handleSelectLobe = (lobe: LobeInfo) => {
    setSelectedLobe(lobe);
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [selectedLobe.id]: optionIndex }));
    setValidated(prev => ({ ...prev, [selectedLobe.id]: null })); // reset validation
  };

  const validateAnswer = () => {
    const answer = userAnswers[selectedLobe.id];
    if (answer === undefined) return;

    if (answer === selectedLobe.scenario.correctIndex) {
      setValidated(prev => ({ ...prev, [selectedLobe.id]: "correct" }));
      onShowNudge(`¡Perfecto! Has descifrado el caso clínico del ${selectedLobe.name}.`);
      
      // Calculate how many are correct and map to overall lobes progress
      const currentCorrectCount = Object.entries(validated).filter(([_, status]) => status === "correct").length + 1;
      const progressPercent = Math.min(100, Math.round((currentCorrectCount / 4) * 100));
      onProgressUnlock("lobulos", progressPercent);
    } else {
      setValidated(prev => ({ ...prev, [selectedLobe.id]: "incorrect" }));
    }
  };

  return (
    <div className="bg-white rounded-[40px] border-4 border-emerald-100 p-6 shadow-xl">
      <div className="mb-6">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase px-3 py-1 rounded-full">
          Simulación Interactiva: Anatomía
        </span>
        <h2 className="title-font text-2xl font-bold mt-2 text-slate-800">
          Explorador de Lóbulos Cerebrales
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Toca cada región del cerebro para descubrir sus funciones de control y resolver los desafíos prácticos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Brain diagram selector panel (Left side) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 border border-slate-100 min-h-[300px]">
          <span className="text-xs text-slate-400 font-mono mb-4 text-center">
            Haz clic en los botones para ubicar la región en la cabeza:
          </span>

          {/* Brain layout simulator map using high-contrast colored boxes arranged like a brain side view */}
          <div className="relative w-64 h-56 border-2 border-dashed border-slate-200 rounded-full flex flex-col items-center justify-center p-2 bg-white shadow-inner">
            
            {/* Frontal (anterior - left) */}
            <button
              onClick={() => handleSelectLobe(LOBES_DATA[0])}
              className={`absolute left-4 top-14 w-24 h-24 rounded-tl-full rounded-b-2xl border flex flex-col items-center justify-center text-center p-1 transition cursor-pointer ${
                selectedLobe.id === "frontal"
                  ? "bg-blue-600 border-blue-800 text-white shadow-lg scale-105"
                  : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              }`}
            >
              <Brain className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">FRONTAL</span>
              <span className="text-[8px] opacity-75">Personalidad</span>
            </button>

            {/* Parietal (superior - right/middle) */}
            <button
              onClick={() => handleSelectLobe(LOBES_DATA[1])}
              className={`absolute right-4 top-4 w-24 h-22 rounded-tr-full rounded-b-xl border flex flex-col items-center justify-center text-center p-1 transition cursor-pointer ${
                selectedLobe.id === "parietal"
                  ? "bg-orange-600 border-orange-850 text-white shadow-lg scale-105"
                  : "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
              }`}
            >
              <MapPin className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">PARIETAL</span>
              <span className="text-[8px] opacity-75">Tacto y Dolor</span>
            </button>

            {/* Temporal (lateral center/lower) */}
            <button
              onClick={() => handleSelectLobe(LOBES_DATA[2])}
              className={`absolute left-16 bottom-6 w-24 h-20 rounded-2xl border flex flex-col items-center justify-center text-center p-1 transition cursor-pointer ${
                selectedLobe.id === "temporal"
                  ? "bg-pink-600 border-pink-850 text-white shadow-lg scale-105"
                  : "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100"
              }`}
            >
              <Volume2 className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">TEMPORAL</span>
              <span className="text-[8px] opacity-75">Oído y Memoria</span>
            </button>

            {/* Occipital (posterior - far right) */}
            <button
              onClick={() => handleSelectLobe(LOBES_DATA[3])}
              className={`absolute right-4 bottom-14 w-22 h-20 rounded-br-full rounded-t-xl border flex flex-col items-center justify-center text-center p-1 transition cursor-pointer ${
                selectedLobe.id === "occipital"
                  ? "bg-emerald-600 border-emerald-850 text-white shadow-lg scale-105"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              <Eye className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">OCCIPITAL</span>
              <span className="text-[8px] opacity-75">Visión</span>
            </button>

            <div className="absolute top-2 left-6 text-[8px] text-slate-400 uppercase font-mono tracking-widest border border-slate-150 px-1 rounded bg-slate-50">
              frente ⬅
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {LOBES_DATA.map((lobe) => (
              <button
                key={lobe.id}
                onClick={() => handleSelectLobe(lobe)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium cursor-pointer transition ${
                  selectedLobe.id === lobe.id
                    ? lobe.activeColor
                    : lobe.color
                }`}
              >
                {lobe.name}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic Lobe description & Quiz panel (Right side) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="border border-slate-100 bg-slate-50 rounded-2xl p-5 mb-4">
            <h3 className="title-font font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full ${selectedLobe.id === 'frontal' ? 'bg-blue-600' : selectedLobe.id === 'parietal' ? 'bg-orange-600' : selectedLobe.id === 'temporal' ? 'bg-pink-600' : 'bg-emerald-600'}`} />
              Detalle: {selectedLobe.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 uppercase font-mono">
              📍 Ubicación: {selectedLobe.coords}
            </p>

            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-500 uppercase">Función Principal:</span>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                {selectedLobe.role}
              </p>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-3">
              <span className="text-xs font-semibold text-neuro-600 uppercase flex items-center gap-1">
                ⭐ Analogía Rural Escolar:
              </span>
              <p className="text-xs text-slate-600 italic mt-1 bg-white p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                "{selectedLobe.analogy}"
              </p>
            </div>
          </div>

          {/* Diagnostic Active Challenge */}
          <div className="bg-white border-2 border-neuro-100 rounded-2xl p-5 shadow-sm">
            <h4 className="title-font font-bold text-slate-800 flex items-center gap-1.5 text-sm uppercase tracking-wide">
              <HelpCircle className="w-5 h-5 text-neuro-500" />
              Evidencia: Caso de Análisis Metacognitivo
            </h4>
            <p className="text-xs text-slate-650 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-150 leading-relaxed font-medium">
              {selectedLobe.scenario.text}
            </p>

            {/* Answer Options */}
            <div className="mt-4 space-y-2">
              {selectedLobe.scenario.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left text-xs p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                    userAnswers[selectedLobe.id] === idx
                      ? "bg-neuro-50 border-neuro-500 text-neuro-900 font-medium"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>{option}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      userAnswers[selectedLobe.id] === idx ? "bg-neuro-500 border-white text-white" : "border-slate-300"
                    }`}
                  >
                    {userAnswers[selectedLobe.id] === idx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Action Verify */}
            {userAnswers[selectedLobe.id] !== undefined && (
              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-dashed border-slate-200 pt-4">
                <button
                  onClick={validateAnswer}
                  className="bg-neuro-600 hover:bg-neuro-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Validar Respuesta
                </button>

                {validated[selectedLobe.id] === "correct" && (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-250 p-2 rounded-lg text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>
                      <strong>¡Correcto!</strong> {selectedLobe.scenario.explanation}
                    </span>
                  </div>
                )}

                {validated[selectedLobe.id] === "incorrect" && (
                  <div className="flex items-center gap-2 bg-red-50 text-red-800 border border-red-250 p-2 rounded-lg text-xs">
                    <AlertCircle className="w-4 h-4 text-red-650 flex-shrink-0" />
                    <span>
                      <strong>Revisa bien...</strong> Analiza con atención cuál es la función específica que describimos arriba.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
