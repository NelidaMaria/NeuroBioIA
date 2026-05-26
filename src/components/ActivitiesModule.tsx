import React, { useState } from "react";
import { CHALLENGES } from "../data";
import { CheckCircle, AlertCircle, Award, ArrowRight, BookOpen, Star, HelpCircle } from "lucide-react";

interface ActivitiesModuleProps {
  xpPoints: number;
  onEarnXP: (points: number) => void;
  onUnlockBadge: (badgeId: string, title: string) => void;
}

export default function ActivitiesModule({ xpPoints, onEarnXP, onUnlockBadge }: ActivitiesModuleProps) {
  const [activeLevel, setActiveLevel] = useState<"basico" | "intermedio" | "avanzado">("basico");

  // LEVEL 1: BÁSICO (Multiple Choice)
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizValidation, setQuizValidation] = useState<"correct" | "incorrect" | null>(null);
  const [basicCompleted, setBasicCompleted] = useState(false);

  // LEVEL 2: INTERMEDIO (Step Re-ordering Sequence Game)
  const [proteinSteps, setProteinSteps] = useState([
    { id: "step_ribosoma", orderValue: 3, label: "Lectura del codón en el Ribosoma" },
    { id: "step_transcripcion", orderValue: 1, label: "El ADN se transcribe a ARN mensajero en el núcleo" },
    { id: "step_t_aminoacidos", orderValue: 4, label: "El ARNt trae los aminoácidos en orden complementario" },
    { id: "step_translocacion", orderValue: 2, label: "El ARNm formado cruza los poros nucleares hacia el citoplasma" }
  ]);
  const [level2Evaluated, setLevel2Evaluated] = useState(false);
  const [level2Success, setLevel2Success] = useState(false);

  // LEVEL 3: AVANZADO (Analytical Situations)
  const [currentCaseIdx, setCurrentCaseIdx] = useState(0);
  const [selectedHypothesis, setSelectedHypothesis] = useState<number | null>(null);
  const [studentArgument, setStudentArgument] = useState("");
  const [caseEvaluated, setCaseEvaluated] = useState(false);
  const [caseFeedback, setCaseFeedback] = useState("");

  const casesData = [
    {
      id: "case_don_chencho",
      title: "Caso 1: El porrazo de Don Chencho",
      context: "Don Chencho es un conocido agricultor de la vereda que se cayó del burro y se golpeó fuertemente la nuca. Al levantarse, dice estar completamente a oscuras (ciego), pero el médico rural confirma que sus ojos no sufrieron ningún rasguño.",
      question: "¿Cuál de estos lóbulos cerebrales se lesionó profundamente tras el golpe anterior?",
      hypotheses: [
        "Lóbulo Parietal (El que registra el calor solar)",
        "Lóbulo Occipital (La pantalla decodificadora de la visión)",
        "Lóbulo Temporal (El sensor auditivo sobre las orejas)",
        "Lóbulo Frontal (El rector de las decisiones del colegio)"
      ],
      correctHypothesis: 1,
      expectedKeywords: ["cámara", "televisor", "occipital", "visión", "nuca"],
      feedbackCorrect: "¡Impresionante análisis! Le has explicado con excelente empatía que el lóbulo occipital es el televisor o monitor de su cerebro. Si bien su cámara (el ojo) está perfecta, el cable o la pantalla occipital sufrieron el apagón.",
      feedbackIncorrect: "Revisa los apuntes. Recuerda que la nuca aloja la central visual de procesamiento."
    },
    {
      id: "case_cooperativa_carmen",
      title: "Caso 2: El dilema bimodal de Doña Carmen",
      context: "Doña Carmen debe estructurar un balance contable meticuloso de la producción láctea y simultáneamente componer un poema folclórico imaginativo para cantarlo en el festival musical de la vereda.",
      question: "¿Cómo interactúan sus hemisferios cerebrales para este reto bimodal?",
      hypotheses: [
        "El hemisferio izquierdo hace los cálculos matemáticos, y el derecho compone el poema imaginativo trabajando en armonía a través del cuerpo calloso.",
        "Trabaja puramente el cerebelo de forma exclusiva sin encender hemisferios.",
        "Cancela el hemisferio izquierdo para enfocarse solo en la música.",
        "Utiliza la médula espinal para hacer las operaciones de sumar bultos."
      ],
      correctHypothesis: 0,
      expectedKeywords: ["calloso", "izquierdo", "derecho", "armonía", "puente"],
      feedbackCorrect: "¡Espléndido! Has comprendido que los dos hemisferios funcionan en tándem como hermanos cooperadores a través del puente de fibra del cuerpo calloso.",
      feedbackIncorrect: "Relee el concepto de hemisferios y cuerpo calloso. Recuerda la cooperación bimodal."
    }
  ];

  // LEVEL 1: MULTIPLE CHOICE HANDLERS
  const handleValidateQuiz = () => {
    if (selectedOpt === null) return;
    const currentQ = CHALLENGES[currentQuizIdx];
    if (selectedOpt === currentQ.correctAnswer) {
      setQuizValidation("correct");
      onEarnXP(50); // Earn 50 XP
    } else {
      setQuizValidation("incorrect");
    }
  };

  const handleNextQuiz = () => {
    setSelectedOpt(null);
    setQuizValidation(null);
    if (currentQuizIdx < CHALLENGES.length - 1) {
      setCurrentQuizIdx(currentQuizIdx + 1);
    } else {
      setBasicCompleted(true);
      onUnlockBadge("basic_conqueror", "Sabio de Selección");
    }
  };

  // LEVEL 2: RE-ORDERING HANDLERS (Clicking to move item up)
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...proteinSteps];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setProteinSteps(updated);
    setLevel2Evaluated(false);
  };

  const handleEvaluateLevel2 = () => {
    // Check if the current list order matches correct value (1, 2, 3, 4)
    const orderMatches = proteinSteps.every((step, idx) => {
      return step.orderValue === idx + 1;
    });

    setLevel2Evaluated(true);
    if (orderMatches) {
      setLevel2Success(true);
      onEarnXP(100);
      onUnlockBadge("sintesis_expert", "Enlazador del Ribosoma");
    } else {
      setLevel2Success(false);
    }
  };

  const handleResetLevel2 = () => {
    setLevel2Evaluated(false);
    setLevel2Success(false);
    // Shuffle slightly
    setProteinSteps([
      { id: "step_translocacion", orderValue: 2, label: "El ARNm formado cruza los poros nucleares hacia el citoplasma" },
      { id: "step_transcripcion", orderValue: 1, label: "El ADN se transcribe a ARN mensajero en el núcleo" },
      { id: "step_t_aminoacidos", orderValue: 4, label: "El ARNt trae los aminoácidos en orden complementario" },
      { id: "step_ribosoma", orderValue: 3, label: "Lectura del codón en el Ribosoma" }
    ]);
  };

  // LEVEL 3: AVANZADO HANDLERS
  const handleEvaluateCase = () => {
    if (selectedHypothesis === null || !studentArgument.trim()) return;
    
    const currentCase = casesData[currentCaseIdx];
    const isHypothesisCorrect = selectedHypothesis === currentCase.correctHypothesis;

    if (!isHypothesisCorrect) {
      setCaseFeedback(currentCase.feedbackIncorrect);
      setCaseEvaluated(true);
      return;
    }

    // Check if student's explanation contains key analytical/rural words
    const argLower = studentArgument.toLowerCase();
    const matchesKeyword = currentCase.expectedKeywords.some(kw => argLower.includes(kw));

    if (matchesKeyword) {
      setCaseFeedback(currentCase.feedbackCorrect);
      onEarnXP(150);
      onUnlockBadge("clinical_evaluator", "Médico Rural Estrella");
    } else {
      setCaseFeedback("Su diagnóstico de estructura es correcto, pero tu argumento explicativo está demasiado corto o le faltan analogías biológicas. Describe qué metáfora rural utilizarías para decírselo de forma lúdica.");
    }
    setCaseEvaluated(true);
  };

  return (
    <div className="bg-white rounded-[40px] border-4 border-emerald-100 p-6 shadow-xl space-y-6">
      
      {/* Levels Switch tab */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-sky-100 text-sky-850 text-xs font-black uppercase px-3 py-1 rounded-full pl-2">
            Módulo Didáctico 🏆
          </span>
          <h2 className="title-font text-2xl font-black text-slate-800 mt-2">
            Actividades de Aprendizaje Guiado
          </h2>
          <p className="text-xs text-slate-500 font-medium italic mt-0.5">
            Gana puntos XP y desbloquea insignias resolviendo desafíos bio-activos.
          </p>
        </div>

        {/* Level selector buttons */}
        <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveLevel("basico")}
            className={`px-3 py-2 text-[10px] font-black uppercase rounded-lg transition cursor-pointer ${
              activeLevel === "basico" ? "bg-white text-emerald-800 shadow" : "text-slate-500"
            }`}
          >
            🟢 Básico
          </button>
          <button
            onClick={() => setActiveLevel("intermedio")}
            className={`px-3 py-2 text-[10px] font-black uppercase rounded-lg transition cursor-pointer ${
              activeLevel === "intermedio" ? "bg-white text-emerald-800 shadow" : "text-slate-500"
            }`}
          >
            🟡 Intermedio
          </button>
          <button
            onClick={() => setActiveLevel("avanzado")}
            className={`px-3 py-2 text-[10px] font-black uppercase rounded-lg transition cursor-pointer ${
              activeLevel === "avanzado" ? "bg-white text-emerald-800 shadow" : "text-slate-500"
            }`}
          >
            🔴 Avanzado
          </button>
        </div>
      </div>

      <div className="border-t border-dashed border-emerald-100 my-4"></div>

      {/* -------------------- NIVEL BÁSICO: OPCIÓN MULTIPLE -------------------- */}
      {activeLevel === "basico" && (
        <div className="space-y-4">
          
          {basicCompleted ? (
            <div className="p-6 bg-emerald-50 border-2 border-emerald-150 rounded-3xl text-center space-y-4 flex flex-col items-center">
              <Award className="w-16 h-16 text-emerald-600 animate-bounce" />
              <div>
                <h3 className="text-xl font-black text-slate-800">¡Nivel Básico Superado! 🎓</h3>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  Has respondido correctamente a los desafíos diagnósticos iniciales. ¡Tienes una gran base cognitiva sobre el cerebro!
                </p>
              </div>
              <button
                onClick={() => { setBasicCompleted(false); setCurrentQuizIdx(0); }}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 cursor-pointer transition"
              >
                Volver a evaluar saberes
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-150 text-[10px]">
                <span className="font-extrabold text-slate-500">Pregunta {currentQuizIdx + 1} de {CHALLENGES.length}</span>
                <span className="font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded">Reto Autoevaluativo</span>
              </div>

              {/* Question Text */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-extrabold text-slate-800 leading-relaxed">
                {CHALLENGES[currentQuizIdx].question}
              </div>

              {/* Options list */}
              <div className="space-y-2">
                {CHALLENGES[currentQuizIdx].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedOpt(idx); setQuizValidation(null); }}
                    className={`w-full text-left p-3.5 text-xs rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      selectedOpt === idx
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-extrabold"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedOpt === idx ? "bg-emerald-600 border-white text-white" : "border-slate-300"
                    }`}>
                      {selectedOpt === idx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Action and feedback row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-dashed border-slate-200">
                <div className="flex gap-2">
                  <button
                    onClick={handleValidateQuiz}
                    disabled={selectedOpt === null}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition cursor-pointer disabled:bg-slate-200"
                  >
                    Comprobar Respuesta
                  </button>

                  {quizValidation !== null && (
                    <button
                      onClick={handleNextQuiz}
                      className="px-4 py-3 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 cursor-pointer transition flex items-center gap-1"
                    >
                      <span>Siguiente Reto</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Inline feedback cards */}
                {quizValidation === "correct" && (
                  <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-2xl text-[10.5px] leading-relaxed max-w-sm text-emerald-900 animate-in">
                    <strong className="block text-emerald-800 font-black mb-0.5">⭐ ¡Correcto! +50 XP</strong>
                    {CHALLENGES[currentQuizIdx].explanation}
                    <p className="mt-1 bg-white p-1.5 rounded-lg border border-emerald-200 font-bold block text-[9.5px]">💡 {CHALLENGES[currentQuizIdx].analogy}</p>
                  </div>
                )}

                {quizValidation === "incorrect" && (
                  <div className="bg-red-50 border border-red-150 p-3.5 rounded-2xl text-[10.5px] leading-relaxed max-w-sm text-red-900 animate-in">
                    <strong className="block text-red-800 font-black mb-0.5 font-bold">⚠️ Vuelve a intentar</strong>
                    La opción que elegiste no encaja con la analogía del sistema. Revisa los apuntes e inténtalo de nuevo.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* -------------------- NIVEL INTERMEDIO: SECUENCIADOR -------------------- */}
      {activeLevel === "intermedio" && (
        <div className="space-y-4">
          <div className="bg-amber-50/50 p-4 rounded-3xl border border-amber-100 flex items-start gap-2.5">
            <Star className="w-5 h-5 text-amber-550 flex-shrink-0 animate-spin" />
            <div className="text-xs leading-relaxed text-amber-950 font-semibold">
              <strong className="block font-black">Actividad de Secuenciación: Síntesis de Proteínas</strong>
              Los bloques de abajo están desordenados. Utiliza las flechas para desplazar cada etapa hasta que queden ordenadas cronológicamente de arriba a abajo en la secuencia ADN ──→ Proteína celular.
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {proteinSteps.map((step, idx) => (
              <div
                key={step.id}
                className="p-4 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-between shadow-sm hover:border-amber-400/50 transition duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 border border-slate-250">
                    {idx + 1}
                  </span>
                  <p className="text-xs font-extrabold text-slate-700">{step.label}</p>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 px-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 disabled:opacity-30 cursor-pointer text-[10px] font-black"
                  >
                    ▲ Subir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Evaluate trigger bar */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-dashed border-slate-200">
            <div className="flex gap-2">
              <button
                onClick={handleEvaluateLevel2}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition cursor-pointer"
              >
                Comprobar Orden
              </button>
              <button
                onClick={handleResetLevel2}
                className="px-3.5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Mezclar de nuevo
              </button>
            </div>

            {level2Evaluated && (
              level2Success ? (
                <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-2xl text-[10.5px] leading-relaxed max-w-sm text-emerald-900 font-semibold animate-in">
                  🎉 ¡Felicidades! Orden perfecto. Conquistaste el ribosoma y enlazaste correctamente la receta de proteínas. <strong>+100 XP</strong> y Badge desbloqueado.
                </div>
              ) : (
                <div className="bg-red-50 border border-red-150 p-3.5 rounded-2xl text-[10.5px] leading-relaxed max-w-sm text-red-900 font-semibold animate-in">
                  ❌ El flujo aún no es el correcto. Tip: La Transcripción del ADN en el Núcleo es SIEMPRE la etapa inicial antes de viajar a pie por el citoplasma hacia los ribosomas.
                </div>
              )
            )}
          </div>

        </div>
      )}

      {/* -------------------- NIVEL AVANZADO: RESOLUCION DE SITUACIONES -------------------- */}
      {activeLevel === "avanzado" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] bg-slate-50 p-3 rounded-xl border border-slate-150">
            <span className="font-extrabold text-slate-500">Examen Superior Analítico</span>
            <span className="uppercase font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded font-black">Nivel Avanzado</span>
          </div>

          {/* Case card */}
          <div className="border border-slate-200 p-5 rounded-3xl bg-slate-50 relative overflow-hidden space-y-3">
            <span className="text-[9px] uppercase font-mono tracking-wider text-red-700 font-extrabold">Lectura clínica:</span>
            <h4 className="font-black text-sm text-slate-800 leading-tight">
              {casesData[currentCaseIdx].title}
            </h4>
            <p className="text-[11.5px] text-slate-600 leading-relaxed font-semibold">
              {casesData[currentCaseIdx].context}
            </p>
          </div>

          {/* Hypothesis multichoice */}
          <div className="space-y-2">
            <label className="text-[10px] pl-1 font-black text-slate-500 uppercase">1. Selecciona tu hipótesis médica diagnóstica:</label>
            {casesData[currentCaseIdx].hypotheses.map((hyp, hIdx) => (
              <button
                key={hIdx}
                onClick={() => { setSelectedHypothesis(hIdx); setCaseEvaluated(false); }}
                className={`w-full text-left p-3 text-xs rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  selectedHypothesis === hIdx
                    ? "bg-red-50 border-red-400 text-red-900 font-extrabold"
                    : "bg-white border-slate-205 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{hyp}</span>
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                  selectedHypothesis === hIdx ? "bg-red-650 border-white text-white" : "border-slate-300"
                }`}>
                  {selectedHypothesis === hIdx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>

          {/* Argument input */}
          <div className="space-y-2">
            <label className="text-[10px] pl-1 font-black text-slate-500 uppercase">2. Argumenta tu diagnóstico con una analogía rural para explicárselo a la familia:</label>
            <textarea
              required
              rows={3}
              value={studentArgument}
              onChange={(e) => { setStudentArgument(e.target.value); setCaseEvaluated(false); }}
              placeholder="Escribe por qué crees que se lesionó esa área y cómo se lo explicarías usando palabras sencillas o metáforas del campo..."
              className="w-full bg-white border-2 border-slate-200 text-xs p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400 text-slate-800 font-semibold"
            />
            <span className="text-[9px] text-slate-400 italic block pl-1">
              * Tip de evaluación: Para que NeuroBioIA valide tu explicación con puntos altos de XP, de usar palabras clave analíticas como <strong className="text-emerald-700 font-black">occipital</strong>, <strong className="text-emerald-700 font-black">visión</strong>, <strong className="text-emerald-700 font-black">televisor</strong>, o <strong className="text-emerald-700 font-black">izquierdo</strong>.
            </span>
          </div>

          {/* Evaluate controls */}
          <div className="pt-4 border-t border-dashed border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={handleEvaluateCase}
                disabled={selectedHypothesis === null || !studentArgument.trim()}
                className="px-5 py-3 bg-red-650 hover:bg-red-750 text-white font-black text-xs rounded-xl transition cursor-pointer disabled:bg-slate-200"
              >
                Someter Diagnóstico Científico
              </button>

              {caseEvaluated && currentCaseIdx < casesData.length - 1 && (
                <button
                  onClick={() => { setCurrentCaseIdx(currentCaseIdx + 1); setSelectedHypothesis(null); setStudentArgument(""); setCaseEvaluated(false); }}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl cursor-pointer transition"
                >
                  Siguiente Caso
                </button>
              )}
            </div>

            {/* Case feedback card */}
            {caseEvaluated && (
              <div className="bg-slate-100 p-4 rounded-2xl border-2 border-slate-200 text-[10px] leading-relaxed max-w-sm text-slate-800 font-semibold animate-in">
                <span className="font-extrabold uppercase text-orange-650 block mb-1">🔍 Evaluación Socrática del Tutor:</span>
                {caseFeedback}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
