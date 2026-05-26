import { QuizQuestion, TopicProgress, Achievement } from "./types";

export const INITIAL_TOPICS: TopicProgress[] = [
  { id: "sistema_nervioso", title: "Sistema Nervioso", percentage: 70, unlocked: true, levelName: "Bio-Iniciando IV" },
  { id: "hemisferios", title: "Hemisferios Cerebrales", percentage: 50, unlocked: true, levelName: "Bio-Novato II" },
  { id: "lobulos", title: "Lóbulos Cerebrales", percentage: 0, unlocked: true, levelName: "Bio-Aspirante I" },
  { id: "proteinas", title: "Síntesis de Proteínas", percentage: 20, unlocked: true, levelName: "Bio-Novato I" }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "sn_iniciado",
    title: "Sinapsis Activa",
    description: "Inició el estudio del Sistema Nervioso y comprendió cómo se conectan las neuronas.",
    icon: "Zap",
    unlocked: true,
    unlockedAt: "2026-05-25"
  },
  {
    id: "hemisferios_completos",
    title: "Mente Equilibrada",
    description: "Identificó correctamente las funciones y lógicas de los hemisferios izquierdo y derecho.",
    icon: "Brain",
    unlocked: true,
    unlockedAt: "2026-05-26"
  },
  {
    id: "lobulo_explorado",
    title: "Geógrafo Cerebral",
    description: "Exploró los 4 lóbulos principales y resolvió los casos prácticos de lesiones cerebrales.",
    icon: "Map",
    unlocked: false
  },
  {
    id: "sintesis_exitosa",
    title: "Bio-Traductor",
    description: "Completó exitosamente la cadena de traducción en la síntesis de proteínas.",
    icon: "Dna",
    unlocked: false
  },
  {
    id: "metacognitivo_estrella",
    title: "Pensador Estrella",
    description: "Respondió a 3 preguntas reflexivas planteadas por el agente de forma correcta.",
    icon: "Award",
    unlocked: false
  }
];

export const STUDY_RESOURCES = [
  {
    topicId: "sistema_nervioso",
    title: "El Sistema Nervioso y la Neurona",
    analogy: "Funciona como el sistema de correos o mensajerías de un pueblo rural. El cerebro es la alcaldía, la médula espinal es el camino principal, y los nervios periféricos son los mensajeros que van a caballo a cada finca.",
    summary: "Se divide en el Sistema Nervioso Central (encéfalo y médula espinal) y Sistema Nervioso Periférico (nervios). La célula clave es la neurona, que recibe estímulos con las dendritas, los procesa en el soma o cuerpo celular, y envía el impulso eléctrico a través del largo axón (aislado por mielina, que funciona como el caucho de un cable de luz para que la electricidad no se pierda) hasta llegar a la sinapsis.",
    keyPoints: [
      "Dendritas: Antenas receptoras del mensaje.",
      "Soma: Cuerpo celular donde se procesa la información y se mantiene viva la célula.",
      "Axón: Cable largo que transmite el impulso eléctrico.",
      "Mielina: Capa protectora que acelera la señal.",
      "Sinapsis: El espacio donde se liberan neurotransmisores (mensajeros químicos) para conectar una neurona con la siguiente."
    ]
  },
  {
    topicId: "hemisferios",
    title: "Hemisferios Cerebrales",
    analogy: "Imagínalo como una cooperativa agrícola liderada por dos hermanos con distintas habilidades. El hermano izquierdo es el administrador que lleva las cuentas exactas en un cuaderno cuadriculado y programa los riegos. El hermano derecho es el diseñador que imagina nuevos cultivos creativos, dibuja los planos de la finca y compone canciones para festejar la cosecha.",
    summary: "El cerebro humano está dividido en dos grandes hemisferios conectados por una autopista de fibras llamada cuerpo calloso, que les permite trabajar juntos de forma sincronizada.",
    keyPoints: [
      "Hemisferio Izquierdo: Domina el lenguaje oral y escrito, razonamiento lógico, operaciones matemáticas, análisis estructurado y control del lado derecho del cuerpo.",
      "Hemisferio Derecho: Domina la intuición, imaginación, expresión artística, apreciación musical, percepción espacial y visualización tridimensional, además de controlar el lado izquierdo del cuerpo.",
      "Cuerpo Calloso: Fibra conectora que permite el diálogo continuo entre ambos lados."
    ]
  },
  {
    topicId: "lobulos",
    title: "Los Cuatro Lóbulos Cerebrales",
    analogy: "Imagínalos como los cuatro delegados de la escuela rural. El Frontal es el rector organizando la jornada escolar; el Parietal es el estudiante alerta sintiendo el calor del sol o el frío del pupitre; el Occipital es el que dibuja en el tablero observando las formas y colores; el Temporal es el profesor que recuerda todas las lecciones del año escolar pasado.",
    summary: "La corteza cerebral de cada hemisferio se divide en cuatro regiones geográficas con tareas altamente especializadas.",
    keyPoints: [
      "Lóbulo Frontal: Ubicado al frente. Controla la planificación, toma de decisiones, control motor fino, resolución de problemas complejos y la personalidad autónoma.",
      "Lóbulo Parietal: Ubicado arriba y atrás. Procesa sensaciones del cuerpo: el tacto, la presión, el dolor, la temperatura corporal y la orientación espacial.",
      "Lóbulo Occipital: Ubicado en la nuca. Es el centro exclusivo del procesamiento de la vista: interpreta formas, colores, distancias y movimientos.",
      "Lóbulo Temporal: Ubicado sobre la oreja. Controla la audición, memoria a largo plazo, comprensión del lenguaje hablado (Área de Wernicke) y el reconocimiento de emociones."
    ]
  },
  {
    topicId: "proteinas",
    title: "La Maravillosa Síntesis de Proteínas",
    analogy: "Como cocinar un plato típico. La receta original está guardada en una gran biblioteca cerrada (el ADN dentro del Núcleo) de donde no puede salir. Así que debes sacar una copia rápida en papel reciclable (el ARN Mensajero). Llevas esa copia de la receta al taller de cocina (el Ribosoma en el citoplasma). Ahí, los ayudantes encargados de los ingredientes (el ARN de Transferencia) traen las piezas exactas llamadas aminoácidos según las instrucciones de la copia de la receta, juntándolas en el orden correcto para cocinar la proteína.",
    summary: "Es el proceso mediante el cual las células construyen las proteínas que le permiten respirar, crecer y estructurar la vida.",
    keyPoints: [
      "Transcripción: Se realiza dentro del núcleo. La molécula de ADN se abre y sirve de molde para fabricar una cadena complementaria llamada ARNm (ARN mensajero).",
      "Traducción: El ARNm viaja fuera del núcleo hacia el Ribosoma. El ribosoma lee la cadena en grupos de 3 letras llamados codones.",
      "ARN de Transferencia (ARNt): Cuenta un anticodón que se acopla al codón correspondiente del ARNm y carga un aminoácido específico.",
      "Enlace Peptídico: Los aminoácidos se van uniendo secuencialmente creando una larga cadena que se convertirá en la proteína activa."
    ]
  }
];

export const CHALLENGES: QuizQuestion[] = [
  // Sistema Nervioso
  {
    id: "q_sn_1",
    topicId: "sistema_nervioso",
    question: "Si el axón de una de nuestras neuronas pierde su capa de mielina, ¿qué le ocurriría principalmente al impulso nervioso?",
    options: [
      "Se detendría por completo y la neurona moriría de inmediato.",
      "El impulso eléctrico viajaría mucho más lento y se disiparía, perdiendo efectividad.",
      "Se volvería infinitamente rápido aumentando nuestros reflejos al máximo.",
      "Cambiaría de dirección y viajaría de regreso hacia las dendritas."
    ],
    correctAnswer: 1,
    explanation: "La mielina actúa como el aislante de un cable de electricidad. Sin ella, el impulso eléctrico pierde rapidez y potencia o se interrumpe, retrasando la comunicación en el cuerpo (como ocurre en la esclerosis múltiple).",
    analogy: "Imagínalo como andar a caballo por un camino lleno de barro y huecos (sin mielina) contra galopar por una carretera seca y pavimentada (con mielina)."
  },
  {
    id: "q_sn_2",
    topicId: "sistema_nervioso",
    question: "¿Qué ocurre físicamente en el espacio sináptico cuando un estímulo eléctrico llega al final del axón neurorregulado?",
    options: [
      "Las neuronas se tocan físicamente y la electricidad salta como un cortocircuito.",
      "La neurona muere para permitir que nazca una neurona nueva con el mensaje.",
      "Se liberan mensajeros químicos llamados neurotransmisores que viajan y activan receptores en la neurona siguiente.",
      "Se inyecta agua salada para transferir cargas magnéticas de forma fluida."
    ],
    correctAnswer: 2,
    explanation: "Las neuronas no se tocan. Tienen una pequeña separación (la brecha sináptica). Al llegar el impulso, se liberan neurotransmisores químicos que cruzan esa brecha y se acoplan a los receptores del otro lado.",
    analogy: "Es idéntico a una canoa transportando un paquete a través de un río para entregarlo en la otra orilla."
  },
  // Hemisferios
  {
    id: "q_h_1",
    topicId: "hemisferios",
    question: "María es una artista de la vereda que crea hermosas esculturas de arcilla basadas en su imaginación, mientras que su hermano lleva el presupuesto contable y las hectáreas de café sembradas sumamente exactas. ¿Qué hemisferio predomina más en cada uno?",
    options: [
      "María domina el hemisferio izquierdo y su hermano el derecho.",
      "Ambos dominan únicamente el cerebelo medio.",
      "María domina el hemisferio derecho (creatividad, formas tridimensionales) y su hermano el izquierdo (números, lógica y finanzas).",
      "Ambos están utilizando puramente el tronco encefálico sin hemisferios activos."
    ],
    correctAnswer: 2,
    explanation: "El hemisferio derecho está altamente implicado con la intuición, visión espacial, formas artísticas y creatividad. El izquierdo sobresale en el razonamiento lineal, matemáticas, orden, secuenciación y cálculo numérico.",
    analogy: "Es como el equipo de un arado: uno guía con precisión técnica la dirección (Izd) y el otro siembra flores y dibuja caminos curvos para que sea agradable (Der)."
  },
  // Lóbulos
  {
    id: "q_l_1",
    topicId: "lobulos",
    question: "Un habitante de la comunidad rural sufre una fuerte caída en su caballo y se golpea gravemente la nuca (zona posterior del cráneo). Al despertar, dice que todo está negro y no puede ver absolutamente nada, a pesar de que sus ojos no sufrieron ningún daño físico. ¿Qué lóbulo de la corteza cerebral se afectó?",
    options: [
      "El lóbulo frontal (ya que olvidó cómo abrir los párpados).",
      "El lóbulo occipital (que es la central que procesa la visión).",
      "El lóbulo temporal (porque el golpe afectó sus oídos).",
      "El lóbulo parietal (puesto que se detuvo el sentido del tacto)."
    ],
    correctAnswer: 1,
    explanation: "El lóbulo occipital está en la zona posterior de la cabeza (la nuca) y es el encargado exclusivo de decodificar e interpretar los impulsos visuales provenientes de las retinas de los ojos.",
    analogy: "El ojo es una excelente cámara de video, pero si desconectas o dañas la pantalla del televisor que muestra la imagen (el lóbulo occipital), no verás nada."
  },
  // Síntesis de Proteínas
  {
    id: "q_p_1",
    topicId: "proteinas",
    question: "Si la transcripción de un gen en ADN tiene la secuencia de bases nitrogenadas 'TAC', ¿cuál será la secuencia exacta complementaria en el ARN mensajero resultante?",
    options: [
      "ATG",
      "AUG",
      "UAC",
      "GUA"
    ],
    correctAnswer: 1,
    explanation: "En la transcripción, la Timina (T) se aparea con Adenina (A), la Adenina (A) del ADN se aparea con Uracilo (U) en el ARN (no con Timina), y la Citosina (C) se aparea con Guanina (G). Por lo tanto, TAC del ADN genera AUG en el ARNm (que es el codón de inicio).",
    analogy: "Es como hacer un molde de llave. Si el molde de ADN tiene una muesca profunda, la masa de ARNm debe quedar perfecta para encajar exactamente."
  }
];
