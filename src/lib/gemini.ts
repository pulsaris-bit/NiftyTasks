import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function suggestSubtasks(taskTitle: string, taskDescription?: string) {
  try {
    const prompt = `Je bent een productiviteitsassistent. Geef een lijst van 3 tot 5 concrete subtasks voor de volgende hoofdtaak: "${taskTitle}". 
    Beschrijving: ${taskDescription || 'Geen beschrijving'}.
    Antwoord in het Nederlands in een JSON formaat met een array van strings genaamd "subtasks".`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || '{"subtasks": []}');
    return result.subtasks as string[];
  } catch (error) {
    console.error("Fout bij het ophalen van subtasks:", error);
    return [];
  }
}

export async function refineTaskTitle(rawInput: string) {
  try {
    const prompt = `Vertaal de volgende ruwe input naar een heldere, actiegerichte taak titel in het Nederlands: "${rawInput}".
    Antwoord alleen met de verbeterde titel.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text?.trim() || rawInput;
  } catch (error) {
    console.error("Fout bij het verfijnen van titel:", error);
    return rawInput;
  }
}
