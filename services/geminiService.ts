
import { GoogleGenAI, Type } from "@google/genai";
import { User, Meal, NutrientInfo } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const NUTRITION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    calories: { type: Type.NUMBER, description: "Total estimated calories in kcal" },
    protein: { type: Type.NUMBER, description: "Estimated grams of protein" },
    carbs: {
      type: Type.OBJECT,
      description: "Carbohydrate breakdown",
      properties: {
        total: { type: Type.NUMBER, description: "Total grams of carbohydrates" },
        fiber: { type: Type.NUMBER, description: "Grams of dietary fiber" },
        sugar: { type: Type.NUMBER, description: "Grams of sugar" },
      },
      required: ['total']
    },
    fat: {
      type: Type.OBJECT,
      description: "Fat breakdown",
      properties: {
        total: { type: Type.NUMBER, description: "Total grams of fat" },
        saturated: { type: Type.NUMBER, description: "Grams of saturated fat" },
      },
      required: ['total']
    },
    vitamins: {
      type: Type.ARRAY,
      description: "List of 2-4 key vitamins and minerals found in the meal",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the vitamin or mineral (e.g., Vitamin C, Iron)" },
          amount: { type: Type.STRING, description: "Estimated amount with units (e.g., '90mg', '18mg')" },
        },
        required: ['name', 'amount']
      }
    },
    sodium: { type: Type.NUMBER, description: "Estimated milligrams (mg) of sodium" },
    mealName: { type: Type.STRING, description: "A short, descriptive name for the meal, e.g., 'Oatmeal with Berries and Nuts'" }
  },
  required: ['calories', 'protein', 'carbs', 'fat', 'vitamins', 'sodium', 'mealName']
};

export const getNutritionalInfo = async (mealDescription: string): Promise<NutrientInfo> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following meal and provide its nutritional information. Be as accurate as possible based on the description. Meal: "${mealDescription}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: NUTRITION_SCHEMA,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as NutrientInfo;
  } catch (error) {
    console.error("Error fetching nutritional info from Gemini:", error);
    throw new Error("Failed to analyze meal. Please try again with a more descriptive input.");
  }
};

const CALORIE_SUGGESTION_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        suggestedCalories: { type: Type.NUMBER, description: "The suggested daily calorie intake in kcal." }
    },
    required: ['suggestedCalories']
};

export const getCalorieSuggestion = async (user: User): Promise<number> => {
    try {
        const prompt = `
            Based on the following user profile, suggest a daily calorie intake goal.
            - Name: ${user.name}
            - Goal: ${user.goal}
            - Height: ${user.height} cm
            - Weight: ${user.weight} kg
            - Health Concerns: ${user.healthConcerns.join(', ') || 'None specified'}
            - Other Details/Preferences: ${user.details || 'None specified'}

            Consider factors like goal (weight loss, gain, maintenance), and general health guidelines.
            Return a single number representing the suggested daily calorie intake.
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: CALORIE_SUGGESTION_SCHEMA,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as { suggestedCalories: number };
        return Math.round(result.suggestedCalories);

    } catch (error) {
        console.error("Error fetching calorie suggestion from Gemini:", error);
        throw new Error("Failed to get calorie suggestion. Please try again later.");
    }
};

const SUGGESTIONS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            description: "A list of 2-3 meal composition suggestions as strings.",
            items: {
                type: Type.STRING,
            },
        },
    },
    required: ['suggestions'],
};

export const getDietarySuggestions = async (user: User, meals: Meal[], todaysWaterIntake: number): Promise<string[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const todaysMeals = meals.filter(m => m.date.startsWith(today));
    const todaysMacros = todaysMeals.reduce((acc, meal) => {
        acc.calories += meal.nutrients.calories;
        acc.protein += meal.nutrients.protein;
        acc.carbs += meal.nutrients.carbs.total;
        acc.fat += meal.nutrients.fat.total;
        acc.sodium += meal.nutrients.sodium;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0 });

    const prompt = `
        You are an expert nutritionist AI. Your task is to provide personalized meal suggestions.
        User Profile:
        - Name: ${user.name}
        - Goal: ${user.goal}
        - Specific Health Concerns: ${user.healthConcerns.join(', ') || 'None'}
        - Other Details: ${user.details || 'None specified'}

        Today's total intake so far:
        - Calories: ${todaysMacros.calories.toFixed(0)} kcal
        - Protein: ${todaysMacros.protein.toFixed(1)}g
        - Carbohydrates: ${todaysMacros.carbs.toFixed(1)}g
        - Fat: ${todaysMacros.fat.toFixed(1)}g
        - Sodium: ${todaysMacros.sodium.toFixed(0)}mg
        - Water Intake: ${todaysWaterIntake} glasses (daily goal is 8).

        Based on all of this information, provide 2-3 specific and actionable suggestions for what their *next* meal could include. When recommending foods, suggest appropriate portion sizes (e.g., 'a 150g serving of salmon', '1 cup of broccoli', 'a handful of almonds'). Tailor your advice directly to their specific health concerns.
        - If concerns include 'diabetes' or 'pre-diabetes', focus on low-glycemic index foods, fiber, and balanced macronutrients.
        - If concerns include 'hypertension', suggest low-sodium options and foods high in potassium.
        - If concerns include 'high-cholesterol', recommend foods low in saturated and trans fats, and high in soluble fiber (like oats, apples, beans).
        - If concerns include 'anemia', suggest foods rich in iron (like lean red meat, lentils, spinach) and vitamin C to aid absorption.
        - If concerns include 'vitamin-d-deficiency', suggest fortified foods (milk, cereal) or fatty fish.
        - If concerns include 'vitamin-b12-deficiency', recommend animal products or fortified nutritional yeast.
        - If concerns include 'pcos', recommend meals that help manage insulin resistance, like those with lean protein, healthy fats, and complex carbs.
        - If their water intake is low, include a friendly reminder to hydrate.
        
        Be encouraging. Address the user by their name, ${user.name}, but do not include a greeting like "Hi ${user.name}" at the start of each suggestion. The suggestions should be full sentences.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: SUGGESTIONS_SCHEMA,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as { suggestions: string[] };
    return result.suggestions;

  } catch (error) {
    console.error("Error fetching dietary suggestions from Gemini:", error);
    throw new Error("Failed to get suggestions. Please try again later.");
  }
};

const UNHEALTHY_FEEDBACK_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        feedback: { type: Type.STRING, description: "A single, short, constructive, and friendly reminder. Empty string if not needed." }
    },
    required: ['feedback']
};

export const getUnhealthyIntakeFeedback = async (mealNutrients: NutrientInfo, user: User): Promise<string | null> => {
    try {
        const prompt = `
            You are a nutritional assistant. Analyze the following meal in the context of the user's health profile.
            User Profile:
            - Goal: ${user.goal}
            - Health Concerns: ${user.healthConcerns.join(', ') || 'None'}
            - Other Details: ${user.details || 'None'}

            Meal Nutrients:
            - Calories: ${mealNutrients.calories}
            - Sugar: ${mealNutrients.carbs.sugar || 0}g
            - Saturated Fat: ${mealNutrients.fat.saturated || 0}g
            - Sodium: ${mealNutrients.sodium || 0}mg

            Based on the user's profile, if this meal is significantly high in a nutrient that could negatively impact their health goals (e.g., high sugar for 'diabetes'/'pre-diabetes', high sodium for 'hypertension', high saturated fat for 'high-cholesterol'), provide one single, short, constructive, and friendly reminder. The reminder should be a single sentence. For example: 'This meal seems a bit high in sugar; balancing it with lower-sugar choices for the rest of the day would be a great idea!'
            If the meal is fine for the user, your feedback should be an empty string. Only provide feedback for significant deviations, not minor ones.
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: UNHEALTHY_FEEDBACK_SCHEMA,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as { feedback: string };
        return result.feedback || null; // Return null if feedback is empty string

    } catch (error) {
        console.error("Error fetching meal feedback from Gemini:", error);
        // Don't throw, just fail silently as it's a non-critical feature
        return null;
    }
};
