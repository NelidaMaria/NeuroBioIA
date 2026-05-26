import React, { useState } from "react";
import { Play, Pause, ChevronRight, ChevronLeft, Volume2, Award, Zap, BookOpen, Layers, RefreshCw } from "lucide-react";

export default function ConceptualizationModule() {
  const [activeSection, setActiveSection] = useState<"sistema" | "hemisferios" | "proteinas">("sistema");
  
  // SECTION 1: SISTEMA NERVIOSO
  const [selectedBrainArea, setSelectedBrainArea] = useState("nervioso_central");
  const [videoPlay, setVideoPlay] = useState(false);
  const [videoChapter, setVideoChapter] = useState(1); // 1, 2, 3

  // Core brain information
  const brainAreasInfo = {
    nervioso_central: {
      title: "Sistema Nervioso Central (SNC)",
      desc: "Compuesto por el encéfalo (dentro del cráneo) y la médula espinal (columna vertebral). Es el cuartel general que toma decisiones lógicas y organiza cada acción del cuerpo humano.",
      analogy: "Funciona como la Alcaldía Municipal y el camino real principal de la vereda, desde donde se emiten decretos y corren los despachos principales.",
      points: ["Encéfalo: El procesador maestro.", "Médula Espinal: Autopista de distribución nerviosa."]
    },
    neuronas: {
      title: "Las Neuronas (Células Conductoras)",
      desc: "Especialistas en transmitir impulsos de bioelectricidad química. Disponen de dendritas receptoras, un soma regulador y un largo cable conductor llamado axón.",
      analogy: "Los mensajeros rurales que recorren caminos a caballo portando noticias urgentes de finca en finca.",
      points: ["Transmisión bioeléctrica: Por impulso salino.", "Mielina: El forro aislante de caucho del axón."]
    },
    glia: {
      title: "Células Gliales (El Equipo de Soporte)",
      desc: "Superan en número a las neuronas. No conducen electricidad, pero limpian bacterias (Microglía), nutren dándole azúcar a las neuronas (Astrocitos), y fabrican vainas de mielina protectoras (Oligodendrocitos).",
      analogy: "Es la junta de vecinos cooperando para limpiar de maleza los senderos, cocinar el almuerzo escolar, y arreglar los puentes rotos.",
      points: ["Astrocitos: Despachan nutrientes (glucosa).", "Oligodendrocitos: Generan la capa protectora mielina."]
    }
  };

  // Concept flip cards data
  const flipCards = [
    {
      title: "Astrocitos 🌟",
      front: "Células nodrizas que alimentan directamente a las neuronas.",
      back: "Nutren entregando glucosa limpia. Limpian toxinas de la sinapsis.",
      analogy: "La cocinera de la escuela preparando el almuerzo nutritivo para los estudiantes."
    },
    {
      title: "Oligodendrocitos 🦾",
      front: "Los fabricantes del revestimiento graso protector.",
      back: "Forman espirales de mielina alrededor de varios axones a la vez para acelerar impulsos.",
      analogy: "El maestro plomero forrando tuberías de agua con aislantes para que no se congelen."
    },
    {
      title: "Microglía 🧼",
      front: "Las células del sistema inmunitario de autodefensa cerebral.",
      back: "Vigilan y patrullan el cerebro buscando virus, bacterias u organelos dañados para tragarlos.",
      analogy: "Los vigilantes o perritos guardianes de la finca ahuyentando a los ladrones."
    }
  ];

  // SECTION 2: HEMISFERIOS CEREBRALES
  const [activeHemisphereEvent, setActiveHemisphereEvent] = useState<"none" | "music" | "math" | "art">("none");

  // SECTION 3: SÍNTESIS DE PROTEÍNAS
  const [proteinStep, setProteinStep] = useState(1); // 1 to 4
  const proteinStepsData = [
    {
      id: 1,
      title: "Paso 1: Transcripción (En el Núcleo)",
      subtitle: "La Receta del ADN original se copia a un ARN mensajero.",
      icon: "📜",
      desc: "El ADN se abre momentáneamente dentro de la biblioteca cerrada del núcleo. Una gran enzima llamada ARN polimerasa lee la secuencia de bases y fabrica una tira complementaria móvil llamada ARN mensajero (ARNm).",
      diagram: "ADN [A-T-G-C] ──> ARNm [U-A-C-G]",
      analogy: "No puedes llevarte el libro original de recetas de la cocina central, entonces haces una fotocopia rápida en papel reciclable para llevártelo en el bolsillo hacia las cocinas."
    },
    {
      id: 2,
      title: "Paso 2: Viaje al Citoplasma (Salida al Taller)",
      subtitle: "El ARNm cruza los poros del núcleo en dirección al Ribosoma.",
      icon: "🚶‍♂️",
      desc: "El ARN mensajero terminado es el emisario oficial. Se escurre a través de pequeños poros nucleares saliendo al citoplasma, y es captado por una máquina de ensamblaje llamada Ribosoma.",
      diagram: "NÚCLEO ──Porillos──> CITOPLASMA ──Encuentra──> RIBOSOMA",
      analogy: "Sales del despacho central de la alcaldía con tu fotocopia de la receta de abonos en mano y te diriges a pie por el sendero hacia la bodega de insumos o el campo de cultivo."
    },
    {
      id: 3,
      title: "Paso 3: Traducción (En el Ribosoma)",
      subtitle: "El ribosoma lee los codones de 3 letras de la receta.",
      icon: "🧬",
      desc: "El ribosoma engancha el ARNm y lo lee de tres en tres letras (bases nitrogenadas). Cada trío representa un codón. Vienen moléculas llamadas ARN de transferencia (ARNt) cargando un aminoácido específico que empalma su anticodón exacto.",
      diagram: "Codón [AUG] ──Engancha──> Anticodón [UAC] con Metionina (Aminoácido)",
      analogy: "Llegas a la bodega y lees que necesitas aserrín, tierra y ceniza (un codón de ingredientes). El cargador (ARNt) trae el bulto exacto para vaciarlo en la mezcladora."
    },
    {
      id: 4,
      title: "Paso 4: Cadena Polipeptídica (Formación de Proteína)",
      subtitle: "Se enlazan los aminoácidos formando la proteína activa.",
      icon: "🥩",
      desc: "A medida que el ribosoma se desliza, se forman enlaces peptídicos que unen secuencialmente cada pieza de aminoácido. Al llegar a un codón de parada (Stop), la tira se suelta, se pliega en 3D en el retículo endoplasmático, y ¡nace una proteína lista!",
      diagram: "Aminoácidos (A1 ─ A2 ─ A3 ─ A4) ──> Estructura 3D Proteína",
      analogy: "Los obreros van uniendo ladrillos con mezcla uno tras otro. Al fundir la última viga, retiras los moldes de madera ¡y tienes una hermosa casa terminada para vivir!"
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Tab select buttons */}
      <div className="bg-white border-4 border-emerald-100 rounded-[30px] p-2 flex gap-2 shadow-lg">
        <button
          onClick={() => setActiveSection("sistema")}
          className={`flex-1 py-3 text-xs font-black uppercase text-center rounded-2xl transition cursor-pointer ${
            activeSection === "sistema" ? "bg-emerald-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          ⚡ Sistema Nervioso
        </button>
        <button
          onClick={() => setActiveSection("hemisferios")}
          className={`flex-1 py-3 text-xs font-black uppercase text-center rounded-2xl transition cursor-pointer ${
            activeSection === "hemisferios" ? "bg-emerald-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          🧠 Hemisferios
        </button>
        <button
          onClick={() => setActiveSection("proteinas")}
          className={`flex-1 py-3 text-xs font-black uppercase text-center rounded-2xl transition cursor-pointer ${
            activeSection === "proteinas" ? "bg-emerald-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          🧪 Síntesis de Proteínas
        </button>
      </div>

      {/* SECTION 1 CONTENT: SISTEMA NERVIOSO */}
      {activeSection === "sistema" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Interactive Brain Map */}
          <div className="lg:col-span-6 bg-white rounded-[40px] border-4 border-emerald-100 p-6 shadow-xl space-y-4">
            <h3 className="title-font font-black text-sm uppercase text-emerald-600 tracking-wider">Mapa Anatómico del Nervioso</h3>
            
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
              Haz clic en cualquier botón de hotspot cerebral para resaltar sus funciones fundamentales e analogías.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 flex items-center justify-center min-h-[220px] relative overflow-hidden">
              {/* Dynamic simulated vector brain scheme with clickable zones */}
              <div className="w-56 h-40 bg-emerald-100/40 rounded-full border-4 border-dashed border-emerald-250 flex items-center justify-center relative shadow-inner">
                {/* Visual brain lobes simulation representation */}
                <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-red-400/30 border border-red-500/40 flex items-center justify-center text-[10px] font-bold text-red-800 animate-pulse">
                  Frontal
                </div>
                <div className="absolute top-1/4 right-1/4 w-14 h-14 rounded-full bg-blue-400/30 border border-blue-500/40 flex items-center justify-center text-[10px] font-bold text-blue-800">
                  Parietal
                </div>
                <div className="absolute bottom-1/3 left-1/3 w-12 h-12 rounded-full bg-yellow-400/30 border border-yellow-500/40 flex items-center justify-center text-[10px] font-bold text-yellow-800">
                  Temporal
                </div>
                <div className="absolute bottom-1/4 right-1/3 w-10 h-10 rounded-full bg-green-400/30 border border-green-500/40 flex items-center justify-center text-[10px] font-bold text-green-800">
                  Cerebelo
                </div>
                
                {/* Clickable Action Hotspots */}
                <button
                  onClick={() => setSelectedBrainArea("nervioso_central")}
                  className={`absolute top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 text-[9px] font-black rounded-full border shadow transition-all cursor-pointer ${
                    selectedBrainArea === "nervioso_central" ? "bg-emerald-500 text-white border-white scale-110" : "bg-white text-slate-700 hover:bg-slate-100 border-slate-300"
                  }`}
                >
                  ⚡ S.N. Central
                </button>
                <button
                  onClick={() => setSelectedBrainArea("neuronas")}
                  className={`absolute bottom-3 left-4 px-2.5 py-1 text-[9px] font-black rounded-full border shadow transition-all cursor-pointer ${
                    selectedBrainArea === "neuronas" ? "bg-emerald-500 text-white border-white scale-110" : "bg-white text-slate-700 hover:bg-slate-100 border-slate-300"
                  }`}
                >
                  🐎 Neuronas
                </button>
                <button
                  onClick={() => setSelectedBrainArea("glia")}
                  className={`absolute bottom-3 right-4 px-2.5 py-1 text-[9px] font-black rounded-full border shadow transition-all cursor-pointer ${
                    selectedBrainArea === "glia" ? "bg-emerald-500 text-white border-white scale-110" : "bg-white text-slate-700 hover:bg-slate-100 border-slate-300"
                  }`}
                >
                  🧹 Células Glía
                </button>
              </div>
            </div>

            {/* Selected Zone Detail Panel */}
            <div className="p-4 bg-emerald-50/50 border border-emerald-150 rounded-2xl space-y-2">
              <h4 className="font-extrabold text-xs text-emerald-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                {brainAreasInfo[selectedBrainArea as keyof typeof brainAreasInfo].title}
              </h4>
              <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                {brainAreasInfo[selectedBrainArea as keyof typeof brainAreasInfo].desc}
              </p>
              <div className="text-[11px] text-slate-800 bg-white p-3 rounded-xl border border-emerald-100 flex items-start gap-1.5">
                <span className="text-sm">🌾</span>
                <div className="leading-relaxed">
                  <strong className="text-emerald-700 block text-[10px] font-black">Analogía Rural:</strong>
                  {brainAreasInfo[selectedBrainArea as keyof typeof brainAreasInfo].analogy}
                </div>
              </div>
            </div>
          </div>

          {/* Socratic Explain Video class mockup */}
          <div className="lg:col-span-6 bg-white rounded-[40px] border-4 border-emerald-100 p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="title-font font-black text-sm uppercase text-sky-650 tracking-wider">Clase Animada: Vías del Impulso</h3>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                Selecciona la lección y simula el reproductor didáctico para ver fluir los diagramas del impulso nervioso.
              </p>

              {/* Video Player Frame Mockup */}
              <div className="bg-slate-900 rounded-3xl p-4 min-h-[180px] flex flex-col justify-between text-white border-2 border-slate-850 relative overflow-hidden shadow-inner">
                {/* Chapter graphics rendering */}
                {videoChapter === 1 && (
                  <div className="flex flex-col items-center justify-center flex-1 py-1 text-center">
                    <Layers className="w-10 h-10 text-emerald-400 animate-bounce mb-2" />
                    <span className="text-xs font-black text-white/95">Capítulo 1: Central Cerebro & Médula</span>
                    <span className="text-[9px] text-slate-350 italic font-mono mt-1">Cerebro ──[Orden Eléctrica]──→ Músculos</span>
                  </div>
                )}
                {videoChapter === 2 && (
                  <div className="flex flex-col items-center justify-center flex-1 py-1 text-center">
                    <Zap className="w-10 h-10 text-yellow-400 animate-pulse mb-2" />
                    <span className="text-xs font-black text-white/95">Capítulo 2: El Camino del Estímulo</span>
                    <span className="text-[9px] text-slate-350 italic font-mono mt-1">Dendrita ─(Soma)──[Impulso en Axón]──→ Sinapsis</span>
                  </div>
                )}
                {videoChapter === 3 && (
                  <div className="flex flex-col items-center justify-center flex-1 py-1 text-center font-mono">
                    <div className="flex gap-4 items-center justify-center mb-2">
                      <div className="w-5 h-5 rounded-full bg-indigo-500" />
                      <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                      <div className="w-5 h-5 rounded-full bg-purple-500" />
                    </div>
                    <span className="text-xs font-black text-white/95">Capítulo 3: Sinapsis Mecánica</span>
                    <span className="text-[9px] text-slate-350 italic font-mono mt-1">Vesículas ──[Se vierten Químicos]──→ Receptores</span>
                  </div>
                )}

                {/* Video controls */}
                <div className="flex items-center justify-between text-slate-300 border-t border-white/10 pt-2 text-[10px] font-mono mt-2">
                  <button
                    onClick={() => setVideoPlay(!videoPlay)}
                    className="flex items-center gap-1 bg-white/15 px-3 py-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer font-bold text-white text-[10px]"
                  >
                    {videoPlay ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-white/90" />
                        <span>Pausa clase</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white/90 stroke-none" />
                        <span>Iniciar lección</span>
                      </>
                    )}
                  </button>
                  <span>Módulo II / IE El Minuto de Dios</span>
                </div>
              </div>

              {/* Chapter navigation block */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => { setVideoChapter(num); setVideoPlay(true); }}
                    className={`p-2.5 rounded-xl text-left border text-[10px] transition cursor-pointer flex flex-col justify-between ${
                      videoChapter === num
                        ? "bg-slate-900 text-white border-slate-900 font-extrabold shadow-md"
                        : "bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block font-black opacity-60">Tema {num}</span>
                    <span className="block truncate">
                      {num === 1 ? "Encéfalo Central" : num === 2 ? "Flujo Impulso" : "Enlace Sinapsis"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Flip Cards and Glial cells subgrid */}
            <div className="pt-2 border-t border-dashed border-emerald-150">
              <span className="text-[9px] font-black uppercase text-emerald-600 block pl-1 mb-2">¡Gira las tarjetas para ver células de soporte!</span>
              <div className="grid grid-cols-3 gap-2">
                {flipCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="group [perspective:800px] h-24 relative select-none cursor-pointer"
                  >
                    <div className="relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] border border-slate-200/60 rounded-xl bg-slate-50 overflow-hidden shadow-sm">
                      {/* Front face */}
                      <div className="absolute inset-0 p-2 flex flex-col justify-between [backface-visibility:hidden] text-center items-center justify-center">
                        <span className="text-[10px] font-extrabold tracking-wide block text-slate-800 leading-tight">{card.title}</span>
                        <span className="text-[8px] text-slate-500 scale-95 leading-tight">{card.front}</span>
                      </div>
                      {/* Back face */}
                      <div className="absolute inset-0 p-2 bg-emerald-50 text-emerald-850 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] text-center items-center justify-center">
                        <span className="text-[8px] leading-tight font-extrabold">{card.back}</span>
                        <span className="text-[8px] italic font-black text-emerald-700 font-sans scale-95 leading-tight">🌾 {card.analogy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2 CONTENT: HEMISFERIOS CEREBRALES */}
      {activeSection === "hemisferios" && (
        <div className="bg-white rounded-[40px] border-4 border-emerald-100 p-6 shadow-xl space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="bg-sky-100 text-sky-850 text-[10px] font-black px-3 py-1 rounded-full uppercase">Cooperadora Cerebral 🚜</span>
            <h3 className="title-font text-xl font-black text-slate-800">Usa los dos hemisferios sincronizadamente</h3>
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
              El cerebro se parte en dos hermanos gemelos liderando juntos una gran cooperativa cafetera. Haz clic en las palancas interactivas de abajo para ver fluir señales químicas por la autopista del Cuerpo Calloso que los conecta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Left side element */}
            <div className="border-4 border-emerald-50 rounded-3xl p-5 bg-gradient-to-tr from-emerald-50/20 to-white flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800">Hermano Izquierdo: El Administrador</h4>
                    <span className="text-[9px] uppercase font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">Lógico & Estructurado</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-650 leading-relaxed font-semibold">
                  Domina el razonamiento analítico de la escuela, las matemáticas precisas, el vocabulario formal, la gramática escrita, y controla con destreza el lado derecho de tu cuerpo física.
                </p>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-[10px] text-slate-700 leading-relaxed font-semibold flex items-start gap-1.5">
                  <span className="text-sm">🌾</span>
                  <div>
                    <strong className="text-emerald-700 block text-[9.5px]">Ejemplo Comunero:</strong>
                    "Lleva las cuentas exactas de los sacos de café cosechados en un cuaderno cuadriculado y dibuja tuberías de riego lineales precisas."
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setActiveHemisphereEvent("math"); }}
                className="w-full py-2 bg-emerald-550 text-white rounded-xl text-[11px] font-bold hover:bg-emerald-600 transition cursor-pointer"
              >
                Poner a Administrar 🧮
              </button>
            </div>

            {/* Right side element */}
            <div className="border-4 border-orange-50 rounded-3xl p-5 bg-gradient-to-tr from-orange-50/20 to-white flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌸</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800">Hermano Derecho: El Diseñador</h4>
                    <span className="text-[9px] uppercase font-mono bg-orange-100 text-orange-850 px-2 py-0.5 rounded font-black">Artístico & Intuitivo</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-650 leading-relaxed font-semibold">
                  Domina la imaginación visual, la composición artística de canciones de la vereda, el diseño de estructuras espaciales 3D, y controla de forma cruzada el lado izquierdo del cuerpo.
                </p>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-[10px] text-slate-700 leading-relaxed font-semibold flex items-start gap-1.5">
                  <span className="text-sm">🌾</span>
                  <div>
                    <strong className="text-orange-700 block text-[9.5px]">Ejemplo Comunero:</strong>
                    "Crea canciones festivas con la flauta, modela jarros de arcilla con barro del río y sueña hermosos diseños paisajistas para la vereda."
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setActiveHemisphereEvent("art"); }}
                className="w-full py-2 bg-orange-500 text-white rounded-xl text-[11px] font-bold hover:bg-orange-650 transition cursor-pointer"
              >
                Poner a Diseñar 🎨
              </button>
            </div>

          </div>

          {/* Autopista del Cuerpo Calloso Simulator Event */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 text-center space-y-3 relative overflow-hidden">
            
            {/* Visual indicator lines */}
            <h4 className="text-[11px] font-black uppercase text-slate-500">Puente Central: Corpo Calloso</h4>
            
            {activeHemisphereEvent === "none" && (
              <p className="text-xs text-slate-500 font-medium">Activa una acción arriba para ver fluir los impulsos entre hemisferios...</p>
            )}

            {activeHemisphereEvent === "math" && (
              <div className="space-y-2 animate-in fade-in">
                <div className="flex justify-center items-center gap-4 text-xs font-mono">
                  <span className="bg-emerald-500 text-white rounded px-2.5 py-1 font-bold">Hemisferio Izquierdo</span>
                  <span className="text-emerald-500 animate-pulse font-extrabold">▶ ▶ [Señales eléctricas de cálculo] ▶ ▶</span>
                  <span className="bg-slate-300 rounded px-2 py-1 text-slate-700 font-medium">Hemisferio Derecho</span>
                </div>
                <p className="text-[10px] text-slate-600 font-semibold italic">"El izquierdo está haciendo sumas, el derecho visualiza la forma de los bultos para que no se caigan."</p>
              </div>
            )}

            {activeHemisphereEvent === "art" && (
              <div className="space-y-2 animate-in fade-in">
                <div className="flex justify-center items-center gap-4 text-xs font-mono">
                  <span className="bg-slate-300 rounded px-2 py-1 text-slate-700 font-medium">Hemisferio Izquierdo</span>
                  <span className="text-orange-500 animate-pulse font-extrabold">◀ ◀ [Señales de color y espacio] ◀ ◀</span>
                  <span className="bg-orange-500 text-white rounded px-2.5 py-1 font-bold">Hemisferio Derecho</span>
                </div>
                <p className="text-[10px] text-slate-650 font-semibold italic">"El derecho imagina nuevos laberintos de plantas, el izquierdo planea la secuencia ordenada de siembra."</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 mt-1">
              <button
                onClick={() => setActiveHemisphereEvent("none")}
                className="text-[9px] text-slate-400 hover:text-slate-600 underline font-bold"
              >
                Restablecer puente
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 3 CONTENT: SÍNTESIS DE PROTEÍNAS */}
      {activeSection === "proteinas" && (
        <div className="bg-white rounded-[40px] border-4 border-emerald-100 p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center gap-4">
            <div>
              <span className="bg-indigo-100 text-indigo-850 text-[10px] font-black uppercase px-3 py-1 rounded-full pl-2">Cadena del Ribosoma</span>
              <h3 className="title-font text-lg font-black mt-2 text-slate-800">Proceso Visual Paso a Paso ADN ──→ Proteína</h3>
            </div>

            {/* Micro progress node list */}
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border transition-all ${
                    proteinStep === step
                      ? "bg-indigo-600 text-white border-indigo-650 shadow"
                      : proteinStep > step
                      ? "bg-emerald-500 text-white border-emerald-650"
                      : "bg-slate-100 text-slate-400 border-slate-200"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Current step detailed card */}
          <div className="border border-slate-150 p-5 rounded-3xl bg-slate-50/70 relative overflow-hidden space-y-4">
            
            {/* Step big symbol */}
            <div className="absolute top-4 right-4 text-3xl opacity-35 select-none font-sans">
              {proteinStepsData[proteinStep - 1].icon}
            </div>

            <div>
              <h4 className="font-extrabold text-slate-800 text-sm leading-tight">
                {proteinStepsData[proteinStep - 1].title}
              </h4>
              <span className="text-[10px] text-indigo-650 font-black italic block mt-0.5">{proteinStepsData[proteinStep - 1].subtitle}</span>
            </div>

            {/* Visual Vector Formula block */}
            <div className="bg-indigo-950 text-indigo-200 p-3.5 rounded-2xl text-center text-xs font-mono font-bold tracking-wide">
              {proteinStepsData[proteinStep - 1].diagram}
            </div>

            {/* Narrative text description */}
            <p className="text-[11.5px] text-slate-750 font-bold leading-relaxed">
              {proteinStepsData[proteinStep - 1].desc}
            </p>

            {/* Analogía de la Vereda */}
            <div className="bg-white border-2 border-emerald-100 p-3.5 rounded-2xl flex items-start gap-2 text-slate-800">
              <span className="text-base">🌾</span>
              <div className="text-[11px] leading-relaxed">
                <strong className="text-emerald-700 block font-black text-[9.5px]">Analogía Tradicional:</strong>
                {proteinStepsData[proteinStep - 1].analogy}
              </div>
            </div>

          </div>

          {/* Navigation sliders buttons */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={() => setProteinStep(Math.max(1, proteinStep - 1))}
              disabled={proteinStep === 1}
              className="flex items-center gap-1 text-[10px] bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-350 text-slate-655 font-bold border border-slate-200 rounded-lg px-3.5 py-2 cursor-pointer transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">
              Página {proteinStep} de 4
            </span>

            <button
              onClick={() => setProteinStep(Math.min(4, proteinStep + 1))}
              disabled={proteinStep === 4}
              className="flex items-center gap-1 text-[10px] bg-slate-900 hover:bg-slate-850 disabled:bg-slate-50 disabled:text-slate-350 text-white font-bold rounded-lg px-3.5 py-2 cursor-pointer transition"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
