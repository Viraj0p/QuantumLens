
import { GoogleGenAI, Type } from "@google/genai";
import { ProblemSolution } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const solveQuantumProblem = async (problem: string): Promise<ProblemSolution> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Solve the following quantum physics problem. Provide a structured JSON response with an explanation, step-by-step breakdown (including LaTeX math), and the final answer.
    
    Problem: ${problem}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          problem: { type: Type.STRING },
          explanation: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                latex: { type: Type.STRING },
              },
              required: ["title", "content"]
            }
          },
          finalAnswer: { type: Type.STRING },
        },
        required: ["problem", "explanation", "steps", "finalAnswer"],
      },
      systemInstruction: "You are an elite Quantum Physics Professor. Use LaTeX for all mathematical expressions. Be rigorous and clear.",
    },
  });

  return JSON.parse(response.text);
};

export const getConceptExplanation = async (concept: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explain the following quantum physics concept in detail, using LaTeX for equations where appropriate: ${concept}`,
    config: {
      systemInstruction: "Provide deep educational insights into quantum mechanics. Use Markdown and LaTeX.",
    }
  });
  return response.text || "Failed to generate explanation.";
};

export const chatWithQuantumExpert = async (message: string, history: { role: 'user' | 'model', content: string }[]) => {
  const chat = ai.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: "You are 'QuantumLens AI', a specialist in quantum mechanics. Answer user questions accurately and mathematically. Use LaTeX for all equations.",
    }
  });

  // Note: we can't easily sync full history with simple implementation, so we simulate turn-based
  const response = await chat.sendMessage({ message });
  return response.text;
};
