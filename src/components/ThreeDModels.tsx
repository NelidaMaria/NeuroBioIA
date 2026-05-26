import React, { useState } from "react";
import { RotateCw, ZoomIn, ZoomOut, Info, AlertCircle, Compass, HelpCircle } from "lucide-react";

interface ModelStructure {
  id: string;
  name: string;
  color: string;
  info: string;
  analogy: string;
  coords3D: { x: number; y: number; z: number; r: number }[]; // sphere/node representations
}

export default function ThreeDModels() {
  const [activeModel, setActiveModel] = useState<"cerebro" | "neurona" | "celula">("cerebro");
  const [rotationY, setRotationY] = useState(45); // angles in degrees
  const [rotationX, setRotationX] = useState(15);
  const [zoom, setZoom] = useState(1.2);
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);

  // Model structures definition
  const cerebroStructures: ModelStructure[] = [
    {
      id: "frontal",
      name: "Lóbulo Frontal",
      color: "rgba(239, 68, 68, 0.75)", // Red
      info: "Está justo detrás de la frente. Controla la planificación de actividades, la toma de decisiones, la personalidad autónoma y el control motor fino.",
      analogy: "Es como el rector de una escuela rural, organizando la jornada académica diaria y decidiendo cuándo sembrar cada cultivo.",
      coords3D: [
        { x: 30, y: -20, z: 20, r: 28 },
        { x: 25, y: -10, z: 30, r: 24 }
      ]
    },
    {
      id: "parietal",
      name: "Lóbulo Parietal",
      color: "rgba(59, 130, 246, 0.75)", // Blue
      info: "Ubicado en la parte superior-trasera. Integra y procesa todas las señales sensitivas del cuerpo: temperatura, tacto, presión, dolor y orientación.",
      analogy: "Es idéntico a un estudiante alerta sintiendo el soplo del viento frío en el camino o el calor del sol sobre su gorra.",
      coords3D: [
        { x: -5, y: -30, z: 15, r: 26 },
        { x: -10, y: -20, z: 25, r: 25 }
      ]
    },
    {
      id: "temporal",
      name: "Lóbulo Temporal",
      color: "rgba(245, 158, 11, 0.75)", // Amber
      info: "Ubicado encima de las orejas. Maneja la comprensión del habla, la audición escolar, el reconocimiento de emociones y la memoria a largo plazo.",
      analogy: "Como la abuela que recuerda con lujo de detalles las historias de la vereda de hace muchos años y reconoce los cantos de cada pájaro.",
      coords3D: [
        { x: 10, y: 10, z: 35, r: 25 },
        { x: -5, y: 5, z: 30, r: 22 }
      ]
    },
    {
      id: "occipital",
      name: "Lóbulo Occipital",
      color: "rgba(139, 92, 246, 0.75)", // Violet
      info: "Ubicado en la nuca. Es el centro de mando que procesa la visión humana: descifra formas, colores, distancias, movimientos y letras.",
      analogy: "Funciona como la pantalla de un televisor antiguo. Capta los impulsos mecánicos del ojo y los proyecta con nitidez en tu mente.",
      coords3D: [
        { x: -35, y: -10, z: 10, r: 24 },
        { x: -30, y: 0, z: 15, r: 22 }
      ]
    },
    {
      id: "cerebelo",
      name: "Cerebelo",
      color: "rgba(16, 185, 129, 0.75)", // Emerald
      info: "Ubicado bajo el lóbulo occipital. Se encarga de la precisión, el equilibrio, la coordinación de movimientos musculares y la postura del cuerpo.",
      analogy: "Es como el jinete experto que mantiene el equilibrio perfecto sobre el caballo por terrenos empinados y resbaladizos.",
      coords3D: [
        { x: -25, y: 25, z: -5, r: 20 },
        { x: -20, y: 30, z: 5, r: 18 }
      ]
    },
    {
      id: "tronco",
      name: "Tronco Encefálico",
      color: "rgba(107, 114, 128, 0.75)", // Grey
      info: "Conecta el cerebro con la médula espinal. Controla hábitos vitales autónomos que no pensamos: respiración, latidos cardíacos y digestión.",
      analogy: "Como el motor de energía de la finca que trabaja día y noche sin parar, de forma silenciosa e independiente de quien lo maneje.",
      coords3D: [
        { x: -5, y: 35, z: -10, r: 15 },
        { x: 0, y: 45, z: -15, r: 12 }
      ]
    }
  ];

  const neuronaStructures: ModelStructure[] = [
    {
      id: "dendritas",
      name: "Dendritas",
      color: "rgba(14, 165, 233, 0.75)", // Sky
      info: "Prolongaciones en forma de ramas que salen del soma. Son las antenas receptoras que captan estímulos o mensajes químicos de otras neuronas.",
      analogy: "Equivalen a los buzones o las antenas de radio colocadas en la entrada de las fincas para recibir cartas y boletines comunales.",
      coords3D: [
        { x: -45, y: -25, z: 0, r: 14 },
        { x: -40, y: 25, z: 5, r: 13 },
        { x: -55, y: 0, z: -10, r: 15 }
      ]
    },
    {
      id: "soma",
      name: "Soma / Cuerpo Celular",
      color: "rgba(219, 39, 119, 0.75)", // Pink
      info: "La parte central de la neurona. Contiene organelos y el núcleo; procesa la estimulación recibida para decidir si dispara un impulso.",
      analogy: "La alcaldía municipal o casa de gobierno de la vereda, donde se procesa toda la correspondencia y se toman las directivas estatales.",
      coords3D: [
        { x: -25, y: 0, z: 0, r: 28 }
      ]
    },
    {
      id: "nucleo_neurona",
      name: "Núcleo Neuronal",
      color: "rgba(59, 130, 246, 0.85)", // Indigo Blue
      info: "Alojado dentro del soma. Custodia el ADN celular que dicta cómo producir las enzimas e intermediarios químicos vitales.",
      analogy: "La oficina cerrada del alcalde, con la caja fuerte donde reposan los planes de vida y mapas de límites agrarios indispensables.",
      coords3D: [
        { x: -25, y: 0, z: 5, r: 12 }
      ]
    },
    {
      id: "axon",
      name: "Axón",
      color: "rgba(245, 158, 11, 0.75)", // Orange
      info: "Canal conductor largo por el que corre de golpe el potencial de acción eléctrico de forma veloz hasta llegar a los terminales sinápticos.",
      analogy: "La línea principal de alta tensión o la carretera pavimentada que cruza rápidamente de un extremo del pueblo al otro.",
      coords3D: [
        { x: 5, y: 0, z: 0, r: 14 },
        { x: 25, y: 0, z: 0, r: 14 }
      ]
    },
    {
      id: "mielina",
      name: "Vaina de Mielina",
      color: "rgba(234, 179, 8, 0.8)", // Yellow
      info: "Capa grasa de aislamiento protector. Aumenta drásticamente la velocidad del impulso eléctrico haciéndolo saltar en los nodos de Ranvier.",
      analogy: "El caucho que recubre un cable eléctrico de cobre, evitando que se pierda la energía y previniendo cortos peligrosos.",
      coords3D: [
        { x: -5, y: 0, z: 0, r: 18 },
        { x: 15, y: 0, z: 0, r: 18 },
        { x: 35, y: 0, z: 0, r: 18 }
      ]
    },
    {
      id: "terminales",
      name: "Botones Terminales",
      color: "rgba(16, 185, 129, 0.8)", // Emerald
      info: "Ramas al final del axón. Almacenan vesículas de neurotransmisores listas para ser vertidas en la brecha sináptica.",
      analogy: "Los carteros a caballo estacionados en la frontera del pueblo listos para partir a repartir encomiendas a otras veredas.",
      coords3D: [
        { x: 55, y: -15, z: 5, r: 12 },
        { x: 55, y: 15, z: -5, r: 12 }
      ]
    }
  ];

  const celulaStructures: ModelStructure[] = [
    {
      id: "nucleo_cel",
      name: "Núcleo Celular",
      color: "rgba(59, 130, 246, 0.8)", // Blue
      info: "El organelo director. Guarda las largas hebras de ADN. Es la central donde se realiza la transcripción para formar el ARN mensajero.",
      analogy: "La gran biblioteca histórica nacional, de donde no se permite retirar libros originales, pero sí sacar fotocopias o resúmenes.",
      coords3D: [
        { x: 0, y: -5, z: 0, r: 28 }
      ]
    },
    {
      id: "ribosomas",
      name: "Ribosomas",
      color: "rgba(220, 38, 38, 0.85)", // Red
      info: "Fábricas compuestas de ARN ribosómico que leen los codones del ARNm y enlazan aminoácidos para crear la cadena proteica.",
      analogy: "El taller artesanal donde se cosen los sacos de lana utilizando la hoja de patrones (ARNm) para saber de qué color es cada línea.",
      coords3D: [
        { x: -35, y: -15, z: 15, r: 6 },
        { x: -10, y: 35, z: -5, r: 6 },
        { x: 25, y: -30, z: 10, r: 6 },
        { x: 30, y: 20, z: 20, r: 6 }
      ]
    },
    {
      id: "mitocondria",
      name: "Mitocondria",
      color: "rgba(249, 115, 22, 0.8)", // Orange
      info: "Suministra energía química a la célula (a través de la producción de ATP) mediante la respiración celular regulada.",
      analogy: "La planta de luz por diésel de la finca o la turbina del río, que provee energía constante para prender las bombillas y picadoras.",
      coords3D: [
        { x: -25, y: 20, z: 20, r: 16 },
        { x: 20, y: -20, z: -20, r: 16 }
      ]
    },
    {
      id: "golgi",
      name: "Aparato de Golgi",
      color: "rgba(168, 85, 247, 0.75)", // Purple
      info: "Empaca, etiqueta y distribuye las proteínas recién formadas dentro y fuera de la célula para su correcto funcionamiento.",
      analogy: "La bodega empacadora de café de la vereda, donde las cargas se clasifican, sellan en bultos y se despachan en jeeps hacia el pueblo.",
      coords3D: [
        { x: -35, y: -5, z: -15, r: 14 },
        { x: -25, y: -15, z: -15, r: 12 }
      ]
    },
    {
      id: "membrana",
      name: "Membrana Plasmática",
      color: "rgba(13, 148, 136, 0.65)", // Teal boundary
      info: "Capa lipídica que recubre la célula. Filtra de forma selectiva qué moléculas, nutrientes y agua pueden cruzar e ingresar.",
      analogy: "El broche de madera y las cercas de alambre de púa que rodean toda la finca, decidiendo qué visitantes pueden entrar por el portón.",
      coords3D: [
        { x: -55, y: -45, z: 0, r: 8 },
        { x: 55, y: 45, z: 0, r: 8 },
        { x: -55, y: 45, z: 0, r: 8 },
        { x: 55, y: -45, z: 0, r: 8 }
      ]
    }
  ];

  const currentStructures = 
    activeModel === "cerebro" ? cerebroStructures :
    activeModel === "neurona" ? neuronaStructures : celulaStructures;

  const handleStructureClick = (id: string) => {
    setSelectedStructureId(id === selectedStructureId ? null : id);
  };

  // Convert 3D coordinate to 2D screen projected coordinate using trigonometry
  const projectPoint = (x: number, y: number, z: number) => {
    // Rotation algorithms around Y and X axis
    const radY = (rotationY * Math.PI) / 180;
    const radX = (rotationX * Math.PI) / 180;

    // Rotate around Y axis
    let x1 = x * Math.cos(radY) - z * Math.sin(radY);
    let z1 = x * Math.sin(radY) + z * Math.cos(radY);

    // Rotate around X axis
    let y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
    let z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

    // simple orthogonal rendering scale + perspective depth effect
    const perspectiveFactor = (150 + z2) / 150;
    const projScale = zoom * 2.2 * perspectiveFactor;

    const screenX = x1 * projScale + 175; // 350x350 box central offset
    const screenY = y2 * projScale + 175;
    const depth = z2;

    return { x: screenX, y: screenY, depth };
  };

  const selectedStructure = currentStructures.find(s => s.id === selectedStructureId);

  return (
    <div className="bg-white rounded-[40px] border-4 border-emerald-100 p-6 shadow-xl space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black uppercase px-3 py-1 rounded-full pl-2">
            Módulo Tecnológico 📊
          </span>
          <h2 className="title-font text-2xl font-black text-slate-800 mt-2">
            Explorador de Modelos 3D Interactivos
          </h2>
          <p className="text-xs text-slate-500 font-medium italic mt-0.5">
            Rota, aplica zoom y selecciona estructuras con información en tiempo real.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => { setActiveModel("cerebro"); setSelectedStructureId(null); }}
            className={`px-3 py-2 text-[10px] font-black uppercase rounded-xl transition cursor-pointer ${
              activeModel === "cerebro" ? "bg-white text-emerald-700 shadow" : "text-slate-500"
            }`}
          >
            🧠 Cerebro
          </button>
          <button
            onClick={() => { setActiveModel("neurona"); setSelectedStructureId(null); }}
            className={`px-3 py-2 text-[10px] font-black uppercase rounded-xl transition cursor-pointer ${
              activeModel === "neurona" ? "bg-white text-emerald-700 shadow" : "text-slate-500"
            }`}
          >
            ⚡ Neurona
          </button>
          <button
            onClick={() => { setActiveModel("celula"); setSelectedStructureId(null); }}
            className={`px-3 py-2 text-[10px] font-black uppercase rounded-xl transition cursor-pointer ${
              activeModel === "celula" ? "bg-white text-emerald-700 shadow" : "text-slate-500"
            }`}
          >
            🧫 Célula
          </button>
        </div>
      </div>

      {/* Main 3D Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* SVG Render Box */}
        <div className="lg:col-span-7 bg-slate-900 border-4 border-slate-800 rounded-3xl p-4 flex flex-col items-center justify-center relative min-h-[400px]">
          
          <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-2xl p-2.5 text-white flex items-center gap-2 shadow-lg z-10">
            <Compass className="w-5 h-5 text-emerald-400 rotate-180 animate-spin" />
            <div className="text-[9px] font-mono uppercase tracking-widest text-slate-300">
              <span className="font-bold text-white">Y:</span> {rotationY}° | <span className="font-bold text-white">X:</span> {rotationX}°
            </div>
          </div>

          {/* Canvas SVG representing 3D nodes projections */}
          <svg className="w-full max-w-[350px] aspect-square overflow-visible cursor-pointer relative z-10">
            {/* Draw abstract connecting skeleton mesh lines */}
            {currentStructures.map((struct, sIdx) => {
              // Connect struct nodes
              return struct.coords3D.map((node, nIdx) => {
                const proj1 = projectPoint(node.x, node.y, node.z);
                
                // Draw connecting wireframe lines to other structures
                const nextStruct = currentStructures[(sIdx + 1) % currentStructures.length];
                const nextNode = nextStruct.coords3D[0];
                const proj2 = projectPoint(nextNode.x, nextNode.y, nextNode.z);

                return (
                  <line
                    key={`line-${sIdx}-${nIdx}`}
                    x1={proj1.x}
                    y1={proj1.y}
                    x2={proj2.x}
                    y2={proj2.y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1.5"
                    strokeDasharray={sIdx % 2 === 0 ? "3 3" : "0"}
                  />
                );
              });
            })}

            {/* Render 3D structures as projected colored circular vectors */}
            {currentStructures.map((struct) => {
              const isSelected = selectedStructureId === struct.id;
              
              return struct.coords3D.map((node, idx) => {
                const proj = projectPoint(node.x, node.y, node.z);
                // Dynamically scale radius by depth & zoom
                const adjustedRadius = node.r * zoom * ((150 + proj.depth) / 150) * 1.15;

                return (
                  <g
                    key={`${struct.id}-${idx}`}
                    onClick={() => handleStructureClick(struct.id)}
                    className="select-none transition-all cursor-pointer"
                  >
                    {/* Shadow pulse ring under highlighted structures */}
                    {isSelected && (
                      <circle
                        cx={proj.x}
                        cy={proj.y}
                        r={adjustedRadius * 1.35}
                        fill="none"
                        stroke="rgba(251, 146, 60, 0.5)"
                        strokeWidth="3"
                        className="animate-ping"
                      />
                    )}

                    {/* Gradient solid ball representing area */}
                    <circle
                      cx={proj.x}
                      cy={proj.y}
                      r={adjustedRadius}
                      fill={struct.color}
                      stroke={isSelected ? "#fb923c" : "rgba(255,255,255,0.25)"}
                      strokeWidth={isSelected ? "3" : "1.5"}
                      style={{ filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.4))" }}
                      className="hover:scale-105 hover:brightness-110 active:brightness-95 transition-all duration-300"
                    />

                    {/* Center nucleus styling element for specific cells */}
                    {struct.id.includes("nucleo") && (
                      <circle
                        cx={proj.x}
                        cy={proj.y}
                        r={adjustedRadius * 0.4}
                        fill="#ffffff"
                        opacity="0.85"
                      />
                    )}

                    {/* Label tags projected directly in 3D scene */}
                    <text
                      x={proj.x}
                      y={proj.y + adjustedRadius + 14}
                      fill={isSelected ? "#fb923c" : "#94a3b8"}
                      textAnchor="middle"
                      className="text-[10px] select-none font-bold font-mono bg-slate-900 pointer-events-none"
                    >
                      {struct.name}
                    </text>
                  </g>
                );
              });
            })}
          </svg>

          {/* Model Controls */}
          <div className="w-full mt-4 bg-slate-800/60 backdrop-blur rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-700/30 z-15">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RotateCw className="w-4 h-4 text-emerald-400 rotate-45" />
              <div className="flex-1 sm:w-28">
                <label className="text-[9px] uppercase font-bold text-slate-300 block mb-1">Rotación Y</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotationY}
                  onChange={(e) => setRotationY(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-700 rounded h-1 cursor-pointer"
                />
              </div>
              <div className="flex-1 sm:w-28">
                <label className="text-[9px] uppercase font-bold text-slate-300 block mb-1">Rotación X</label>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={rotationX}
                  onChange={(e) => setRotationX(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-700 rounded h-1 cursor-pointer"
                />
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 text-white justify-end w-full sm:w-auto border-t sm:border-t-0 border-slate-700/50 pt-3 sm:pt-0">
              <button
                onClick={() => setZoom(Math.max(0.6, zoom - 0.15))}
                className="p-2 bg-slate-700 hover:bg-slate-650 rounded-xl transition cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-mono font-bold w-12 text-center text-slate-200">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2.5, zoom + 0.15))}
                className="p-2 bg-slate-700 hover:bg-slate-650 rounded-xl transition cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Selected Area Detail Metadata Pop-up */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          
          {selectedStructure ? (
            <div className="bg-emerald-50/40 p-5 rounded-3xl border-2 border-emerald-100/50 space-y-4 flex flex-col h-full justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: selectedStructure.color }}>
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{selectedStructure.name}</h3>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#fb923c] font-mono">Estructura Activa</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-emerald-200/55 my-2"></div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedStructure.info}
                </p>

                <div className="bg-white border-2 border-emerald-100 p-3.5 rounded-2xl flex items-start gap-2 text-slate-800 shadow-sm">
                  <span className="text-xl">🌾</span>
                  <div className="text-xs leading-relaxed">
                    <strong className="text-emerald-700 font-extrabold block">Analogía de la Vereda:</strong>
                    <span className="font-semibold text-slate-650">{selectedStructure.analogy}</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50/50 border border-orange-100 p-3 rounded-2xl flex items-center gap-2 text-[10px] text-orange-850 font-bold mt-4">
                <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>Prueba rotando la bola para ver la estructura en 3D desde atrás.</span>
              </div>
            </div>
          ) : (
            <div className="border-4 border-dashed border-slate-150 rounded-3xl p-6 h-full flex flex-col items-center justify-center text-center text-slate-450 space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-350 animate-bounce" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-700">Explorador Listo</h3>
                <p className="text-xs text-slate-500 px-4 mt-1 leading-relaxed">
                  Haz clic en cualquiera de las esferas de colores en el espacio virtual 3D para iluminarla, revelar su función y ver su analogía de la vereda rural.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
