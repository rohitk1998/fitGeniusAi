import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FitnessResponse } from "../types";

// Initialize the client. Ensure process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFitnessPlan = async (profile: UserProfile): Promise<FitnessResponse> => {
  const prompt = `
    Create a personalized fitness and nutrition plan for a user with the following stats:
    - Age: ${profile.age}
    - Height: ${profile.height} cm
    - Weight: ${profile.weight} kg
    - Goal: ${profile.goal}
    - Activity Level: ${profile.activityLevel}
    - Target Timeline: ${profile.timeline} months
    - Specific Preferences/Injuries: ${profile.additionalInfo || "None"}

    Provide a concise summary, a macronutrient breakdown, a sample workout schedule for a week (grouping days if needed, e.g., Mon/Wed/Fri), and monthly milestones based on the timeline.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A motivating executive summary of the plan." },
          nutrition: {
            type: Type.OBJECT,
            properties: {
              dailyCalories: { type: Type.NUMBER },
              protein: { type: Type.STRING, description: "e.g., '150g'" },
              carbs: { type: Type.STRING },
              fats: { type: Type.STRING },
              keyFoods: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of recommended foods"
              }
            },
            required: ["dailyCalories", "protein", "carbs", "fats", "keyFoods"]
          },
          weeklySchedule: {
            type: Type.ARRAY,
            description: "A list of workout days or splits",
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING, description: "e.g., 'Monday - Chest & Triceps'" },
                focus: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      exercise: { type: Type.STRING },
                      sets: { type: Type.STRING },
                      reps: { type: Type.STRING }
                    },
                    required: ["exercise", "sets", "reps"]
                  }
                }
              },
              required: ["day", "focus", "exercises"]
            }
          },
          milestones: {
            type: Type.ARRAY,
            description: "Expected progress markers based on the timeline provided.",
            items: {
              type: Type.OBJECT,
              properties: {
                month: { type: Type.NUMBER },
                description: { type: Type.STRING },
                expectedResult: { type: Type.STRING, description: "e.g., 'Weight: 78kg'" }
              },
              required: ["month", "description", "expectedResult"]
            }
          }
        },
        required: ["summary", "nutrition", "weeklySchedule", "milestones"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No data received from Gemini.");
  }

  try {
    return JSON.parse(response.text) as FitnessResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Failed to parse fitness plan.");
  }
};