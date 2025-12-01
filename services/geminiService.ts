import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SolutionData, UserInput, TuningParams, Language } from "../types";
import { translations } from "../translations";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const solutionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A dynamic, action-oriented title for the solution."
    },
    summary: {
      type: Type.STRING,
      description: "A 1-2 sentence strategic summary of the situation."
    },
    immediateAction: {
      type: Type.STRING,
      description: "The ignition: the single most effective immediate action (under 5 minutes)."
    },
    scenarios: {
      type: Type.ARRAY,
      description: "Two distinct strategic approaches.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING, description: "Name of the strategy (e.g., 'The Safe Route')" },
          tagline: { type: Type.STRING, description: "Short punchy description" },
          description: { type: Type.STRING, description: "Overview of this approach" },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          timeline: {
            type: Type.ARRAY,
            description: "3-4 key milestones for visualization",
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, description: "Short label (e.g., Day 1)" },
                description: { type: Type.STRING, description: "Milestone name" },
                timeEstimate: { type: Type.STRING, description: "Est time (e.g., '2 Weeks')" }
              }
            }
          }
        },
        required: ["id", "name", "tagline", "description", "riskLevel", "steps", "timeline", "pros", "cons"]
      }
    }
  },
  required: ["title", "summary", "immediateAction", "scenarios"]
};

export const generateSolution = async (input: UserInput, language: Language, tuning?: TuningParams): Promise<SolutionData> => {
  try {
    const langName = translations[language]?.tagline ? language : 'English'; // Fallback logic if needed, but we pass code usually

    let prompt = `
      The user has a challenge: "${input.problem}".
      ${input.goal ? `Specific Goal: "${input.goal}"` : ''}
      ${input.constraints ? `Constraints/Limitations: "${input.constraints}"` : ''}
      
      Act as "Orbit", a strategic performance coach.
      Your goal is to align the user's trajectory.
      
      Generate TWO distinct scenarios/trajectories for them to choose from:
      1. A "Steady Orbit" (Lower risk, sustainable, steady progress).
      2. A "Slingshot Maneuver" (Higher risk, faster results, bold action).
      
      Be energetic, precise, and encouraging.
      Focus on momentum.

      IMPORTANT: Generate the response strictly in the ${langName} language (Language Code: ${language}). All fields in the JSON (title, summary, action, steps, etc.) must be in ${language}.
    `;

    if (tuning) {
        prompt += `
        
        CRITICAL: The user has adjusted the flight parameters. Adjust the advice based on these settings (scale 0-100):
        
        - Risk Tolerance: ${tuning.riskTolerance}/100. 
          ${tuning.riskTolerance > 70 ? "Suggest very bold, high-variance moves." : tuning.riskTolerance < 30 ? "Prioritize safety and stability above all." : "Balance risk and reward."}
        
        - Velocity (Urgency): ${tuning.velocity}/100.
          ${tuning.velocity > 70 ? "Focus on shortcuts, hacks, and immediate results." : tuning.velocity < 30 ? "Focus on long-term foundations and slow growth." : "Standard pacing."}
          
        - Innovation (Creativity): ${tuning.innovation}/100.
          ${tuning.innovation > 70 ? "Think outside the box. Unconventional solutions." : "Stick to proven, pragmatic methods."}
        `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: solutionSchema,
        systemInstruction: `You are Orbit. You turn chaos into alignment. Return strictly JSON in ${language}.`,
        temperature: tuning ? (tuning.innovation / 100) * 1.5 : 0.5, // Dynamic temperature based on innovation
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    const data = JSON.parse(text) as SolutionData;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};