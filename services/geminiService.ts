
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FitnessResponse, MealMacro, RecoveryAnalysis } from "../types";

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

    Provide a concise summary, a macronutrient breakdown (including fiber), 3 specific example meals with calculated macros that fit the diet, a sample workout schedule for a week, and monthly milestones.
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
              fiber: { type: Type.STRING, description: "e.g., '30g'" },
              keyFoods: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of recommended foods"
              },
              exampleMeals: {
                type: Type.ARRAY,
                description: "3 example meals fitting the diet",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    calories: { type: Type.NUMBER },
                    protein: { type: Type.NUMBER },
                    carbs: { type: Type.NUMBER },
                    fats: { type: Type.NUMBER },
                    fiber: { type: Type.NUMBER }
                  },
                  required: ["name", "calories", "protein", "carbs", "fats", "fiber"]
                }
              }
            },
            required: ["dailyCalories", "protein", "carbs", "fats", "fiber", "keyFoods", "exampleMeals"]
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

export const analyzeFoodContent = async (foodDescription: string): Promise<MealMacro> => {
  const prompt = `
    Analyze the nutritional content of the following food item/meal: "${foodDescription}".
    Estimate the portion size if not specified (default to average serving).
    Return the calories, protein, carbs, fats, and fiber.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "A short, clean name for the food identified" },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fats: { type: Type.NUMBER },
          fiber: { type: Type.NUMBER }
        },
        required: ["name", "calories", "protein", "carbs", "fats", "fiber"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No data received from Gemini.");
  }

  return JSON.parse(response.text) as MealMacro;
};

export const analyzeRecovery = async (hours: number, quality: string, soreness: string): Promise<RecoveryAnalysis> => {
  const prompt = `
    Analyze recovery for a user who slept ${hours} hours with '${quality}' quality and has '${soreness}' muscle soreness.
    Determine a readiness score (0-100).
    Provide a recommendation (Rest, Active Recovery, Maintain, or Push Hard).
    Provide specific advice on how to adjust today's workout or nutrition.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          readinessScore: { type: Type.NUMBER },
          summary: { type: Type.STRING, description: "Brief analysis of recovery state" },
          recommendation: { type: Type.STRING, enum: ["Rest", "Active Recovery", "Maintain", "Push Hard"] },
          workoutAdjustment: { type: Type.STRING, description: "Specific advice for today's training" }
        },
        required: ["readinessScore", "summary", "recommendation", "workoutAdjustment"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No data received from Gemini");
  }
  
  return JSON.parse(response.text) as RecoveryAnalysis;
};
