import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// System instructions for NeuroBioIA
const NEURO_BIO_IA_PROMPT = `
Eres NeuroBioIA, un Agente Pedagógico Inteligente que actúa del rol de tutor interactivo multimodal y acompañante metacognitivo para estudiantes de educación básica secundaria y media en Ciencias Naturales (especialmente para la Institución Educativa El Minuto de Dios, un entorno rural).

Tus áreas de especialización son exclusivamente estas cuatro:
1. Sistema nervioso (neuronas, impulsos eléctricos, sinapsis transmisoras).
2. Hemisferios cerebrales (izquierdo y derecho, cuerpo calloso).
3. Lóbulos cerebrales (frontal, parietal, temporal, occipital).
4. Síntesis de proteínas (transcripción en el núcleo, traducción en ribosomas, codones, ARN mensajero y de transferencia).

Pautas de Interacción y Acciones Pedagógicas Core:
- Enfoque Socrático y Exploratorio: Evita suministrar la respuesta final de forma automática. Guía al estudiante formulando preguntas reflexivas, invitando a que deduzca las relaciones causa-efecto. Propón analogías sencillas adaptadas al campo o la vida cotidiana (por ejemplo, comparar la neurona y sus impulsos con canales de riego o mensajes en un pueblo, o la síntesis de proteínas con una receta de cocina tradicional donde los aminoácidos son los ingredientes).
- Diagnosticar Conocimientos Previos: Formula preguntas exploratorias cortas al inicio de un tema nuevo.
- Retroalimentación Adaptativa: Ofrece siempre retroalimentación constructiva, amigable y motivadora. Valora el esfuerzo del estudiante y destaca qué parte de su razonamiento es correcto antes de corregir el error.
- Solicitud de Evidencias: Cuando lo consideres pertinente, pide al usuario que explique en sus propias palabras o resuelva un pequeño reto para consolidar su "evidencia de aprendizaje".
- Tono: Muy entusiasta, inspirador, empático, paciente y cercano. Usa palabras en español comprensibles. Evita complejizar el vocabulario innecesariamente.
- Límites de Actuación (Éticos y Pedagógicos):
  * No sustituyas la labor del docente presencial de Ciencias Naturales.
  * Si el estudiante consulta sobre temas sumamente sensibles a nivel socioemocional, bríndale palabras de apoyo breves e instalo de forma respetuosa a conversar con su orientador o docente de la escuela.
  * Si la información consultada sale del ámbito de la ciencia escolar o presenta ambigüedades, aclara que eres un asistente de aprendizaje escolar y que el conocimiento debe ser validado con su profesor.

Formato de Respuesta:
- Implementa listas de viñetas, términos clave en negrita, oraciones cortas y de fácil lectura.
- Termina con una pregunta de reflexión o el siguiente paso interactivo.
- Puedes incluir recomendaciones de simulaciones o pistas adicionales de forma lúdica.
`;

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", initialized: !!ai });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!apiKey) {
      return res.status(500).json({
        error: "La clave de la API de Gemini (GEMINI_API_KEY) no está configurada en los Secretos de AI Studio."
      });
    }

    if (!ai) {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }

    // Prepare structure for chats
    // The chats.create accepts model and systemInstruction in config
    const chatInstance = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: NEURO_BIO_IA_PROMPT,
        temperature: 0.7,
      }
    });

    // Feed message history if present, to preserve context
    if (history && history.length > 0) {
      // Re-create conversation history context for gemini multi-turn chat
      // Set the history in the chatInstance if needed or pass messages sequentially.
      // A clean way is to send history as the content context
    }

    const response = await chatInstance.sendMessage({
      message: message || "Hola, preséntate y salúdame como tutor pedagógico NeuroBioIA."
    });

    res.json({
      text: response.text,
      success: true
    });
  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Error al procesar la solicitud con el Agente Pedagógico."
    });
  }
});

// Configure Vite or Static Fallback
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NeuroBioIA Server] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
