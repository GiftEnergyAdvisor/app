/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getEnergyAdvice(context: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert energy efficiency consultant. 
      Based on the following household energy context, provide 3-5 specific, actionable tips to save energy and improve efficiency.
      Keep the advice technical yet accessible.
      
      Context: ${context}`,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting energy advice:", error);
    return "I'm sorry, I couldn't generate advice at this moment. Please check your energy demands and try again later.";
  }
}

export async function getBackupGuidance(totalLoadWatts: number, hoursNeeded: number) {
  try {
    const totalKwhNeeded = (totalLoadWatts * hoursNeeded) / 1000;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `A household has a peak load of ${totalLoadWatts} Watts and needs backup for ${hoursNeeded} hours (approx ${totalKwhNeeded.toFixed(2)} kWh).
      Provide a brief recommendation for a backup system (Solar/Battery vs Inverter vs Generator).
      Mention specific battery capacity or inverter size they should look for.
      Format the response as a clear recommendation covering:
      1. Recommended System Type
      2. Suggested Specs (Capacity/Size)
      3. Estimated Cost Range
      4. Pros/Cons for this Specific Load`,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting backup guidance:", error);
    return "Could not generate backup guidance. Please consult an electrician.";
  }
}
