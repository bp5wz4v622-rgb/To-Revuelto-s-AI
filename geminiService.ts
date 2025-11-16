import { GoogleGenAI, Modality, Type, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const performDeepResearch = async (query: string) => {
  const prompt = `Actúa como un delegado de investigación. Busca únicamente en sitios gubernamentales (.gov), organizaciones sin fines de lucro (.org) o de las Naciones Unidas (un.org) para responder la siguiente pregunta: "${query}". Tu tarea principal es clasificar la información encontrada por fecha de publicación, de la más reciente a la más antigua. No proporciones una respuesta directa. En su lugar, devuelve una lista numerada de los enlaces a las fuentes relevantes, comenzando con la más reciente. Para cada enlace, proporciona una breve descripción de una oración sobre su contenido. Asegúrate de dejar una línea vacía entre cada elemento de la lista. Importante: los enlaces deben ser completos y específicos, apuntando directamente a la página con la información relevante, no a la página de inicio del dominio. Por ejemplo, en lugar de 'https://www.trade.gov/', proporciona algo como 'https://www.trade.gov/learn-how-export'.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const textResponse = response.text;
  
  return { textResponse, groundingChunks };
};

export const generateOrEditImage = async (prompt: string, image?: File) => {
    if (image) {
        // Edit image logic
        const imagePart = await fileToGenerativePart(image);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No se pudo editar la imagen.");
    } else {
        // Generate image logic
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No se pudo generar la imagen personalizada.");
    }
};

export const solveProblem = async (problem: string) => {
    const prompt = `Resuelve el siguiente problema matemático o de lógica con la máxima precisión, mostrando tu razonamiento paso a paso: "${problem}"`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 24576 }
        }
    });

    return response.text;
};

export const analyzeContent = async (text: string, image?: File) => {
    let parts: any[] = [{ text: `Analiza y condensa la siguiente información en un resumen conciso:\n\n${text}` }];
    if (image) {
        const imagePart = await fileToGenerativePart(image);
        parts = [imagePart, { text: `Analiza la imagen y el siguiente texto, y luego condensa la información en un resumen conciso:\n\n${text}` }];
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: parts }
    });
    
    return response.text;
};

export const startInterpellation = async (speech: string) => {
    const systemInstruction = `Actúa como un delegado experto de un Modelo de Naciones Unidas (MUN). Tu rol es ser crítico y analítico. El usuario te proporcionará su discurso. Tu primera tarea es analizarlo, identificar sus puntos más débiles, inconsistencias lógicas o áreas que carecen de evidencia. Luego, inicia un debate formulando una pregunta coherente y desafiante basada en tu análisis. A partir de ahí, debate las respuestas del usuario.

**Regla fundamental:** Debes comunicarte **estrictamente en tercera persona**. No utilices nunca pronombres como "yo", "mi", "pienso que", "usted", "su", "tú" o "ustedes". Habla siempre como si representaras a una delegación. 

Ejemplos de cómo debes expresarte:
-   "La delegación se pregunta..."
-   "Resulta preocupante para esta delegación que el delegado afirme..."
-   "¿Podría la delegación del orador aclarar su postura sobre...?"
-   "La delegación de [Tu País Ficticio] se cuestiona qué está haciendo la delegación del orador para..."

No hagas un resumen del discurso; en su lugar, ataca directamente un punto débil para iniciar la interpelación, siempre manteniendo la perspectiva en tercera persona.`;

    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-pro',
        config: {
            systemInstruction,
        },
    });

    const response = await chat.sendMessage({ message: speech });
    return { chat, firstMessage: response.text };
};

export const continueInterpellation = async (chat: Chat, message: string) => {
    const response = await chat.sendMessage({ message });
    return response.text;
};

export const correctSpeech = async (speech: string, time: string) => {
    const prompt = `
        Eres un experto en oratoria y Modelos de Naciones Unidas. Tu tarea es corregir y reescribir el siguiente discurso para que cumpla con los más altos estándares de un MUN y se ajuste a un límite de tiempo específico.

        Discurso del delegado:
        "${speech}"

        Tiempo disponible: ${time}.

        Reglas de corrección:
        1.  **Estructura del Discurso:** Asegúrate de que el discurso siga esta estructura en tres partes:
            *   **Introducción (Nivel mundial):** Aborda la problemática desde una perspectiva global, usando datos de organismos internacionales (ONU, OMS, UNESCO, etc.). El objetivo es contextualizar y captar la atención.
            *   **Desarrollo (Nivel nacional):** Enfoca el problema en el país que el delegado representa. Explica cómo afecta al país y qué políticas se han implementado. El objetivo es demostrar conocimiento de la posición nacional.
            *   **Conclusión (Nivel internacional / Propuestas):** Plantea soluciones y recomendaciones realistas que el país propone a la comunidad internacional. Deben ser cooperativas y alineadas con los principios de la ONU.
        2.  **Ajuste de Tiempo:** El discurso reescrito debe poder leerse en voz alta dentro del tiempo especificado, MENOS 5 segundos. Por ejemplo, si el tiempo es 1:30, el discurso debe durar aproximadamente 1:25. Condensa las ideas, elimina redundancias y usa un lenguaje impactante y conciso para cumplir con este requisito.
        3.  **Claridad y Persuasión:** Mejora la redacción para que sea clara, persuasiva y diplomática.
        4.  **Perspectiva en Tercera Persona:** El discurso debe estar escrito estrictamente en tercera persona. El delegado habla en nombre de su país. Utiliza frases como "La delegación de..." o "El país que esta delegación representa...". Evita por completo el uso de pronombres en primera persona como "yo" o "nosotros", y en segunda persona como "usted" o "ustedes".

        Entrega únicamente el texto del discurso corregido y reescrito, listo para ser pronunciado. No añadas comentarios introductorios o finales.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });
    return response.text;
};


export const correctPositionPaper = async (data: { commission: string, topic: string, delegation: string, delegate: string, content: string }) => {
    const prompt = `
        Eres un asesor experto en Modelos de Naciones Unidas (MUN). Tu tarea es revisar el siguiente borrador de documento de posición y proporcionar sugerencias constructivas para mejorarlo. No reescribas el documento. En su lugar, ofrece una lista clara de recomendaciones.

        **Información del Documento:**
        -   **Comisión:** ${data.commission}
        -   **Tópico:** ${data.topic}
        -   **Delegación:** ${data.delegation}
        -   **Delegado:** ${data.delegate}

        **Contenido del Documento Original:**
        "${data.content}"

        **Instrucciones para tus sugerencias:**
        1.  **Enfoque en Mejoras:** Analiza el contenido y la estructura. Señala los puntos débiles y explica cómo se pueden fortalecer. Por ejemplo, si la argumentación es débil, si necesita más datos, o si la estructura no es la adecuada.
        2.  **Sugerencias de Estructura:** Comenta si el documento sigue la estructura lógica de un MUN (contexto global, postura nacional, soluciones propuestas). Si no lo hace, sugiere cómo reorganizarlo.
        3.  **Calidad de la Redacción:** Ofrece consejos sobre cómo mejorar la claridad, el tono diplomático y la persuasión del lenguaje.
        4.  **Uso de Fuentes:** Evalúa el uso de fuentes. Si son necesarias más, recomienda tipos de fuentes fiables (ONU, ONGs, etc.) que podrían respaldar los argumentos.
        5.  **Formato de Salida:** Presenta tus comentarios como una lista de puntos claros y concisos en texto plano. No uses caracteres de markdown como asteriscos (*) o numerales (#). Utiliza guiones (-) o números seguidos de un punto para cada sugerencia. No devuelvas el documento corregido, solo la lista de sugerencias.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });
    return response.text;
}

export const getTopicBreakdown = async (topic: string) => {
    const prompt = `
        Actúa como un experimentado director de comité de Modelo de Naciones Unidas. Se te ha asignado el siguiente tópico: "${topic}".

        Tu tarea es crear una lista de preguntas guía esenciales para ayudar a un delegado a investigar este tópico de manera exhaustiva y prepararse para el debate. Las preguntas deben cubrir las diferentes facetas del problema para asegurar una comprensión profunda.

        Genera preguntas que exploren lo siguiente:
        1.  **Definición y Antecedentes:** Preguntas para entender la historia, las causas y la definición del problema.
        2.  **Impacto Global y Regional:** Preguntas sobre cómo el problema afecta a diferentes regiones y a la comunidad internacional en general.
        3.  **Marco Jurídico y Acciones Pasadas:** Preguntas sobre tratados, convenciones y resoluciones de la ONU que ya existan sobre el tema.
        4.  **Posturas de Bloques y Países Clave:** Preguntas para investigar las diferentes posturas de los principales actores internacionales.
        5.  **Soluciones Propuestas:** Preguntas que inspiren al delegado a pensar en soluciones innovadoras y viables.

        Devuelve únicamente una lista numerada de preguntas. No añadas introducciones, conclusiones ni ningún otro texto.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};