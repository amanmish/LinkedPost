import { formatWithOpenAI } from "./openai";
import { formatWithGroq } from "./groq";

export async function formatContent(content: string, customInstructions?: string): Promise<string> {
  // Try OpenAI first (primary)
  try {
    console.log("Attempting OpenAI...");
    const result = await formatWithOpenAI(content, customInstructions);
    console.log("OpenAI succeeded");
    return result;
  } catch (openaiError) {
    console.error("OpenAI failed:", openaiError);

    // Fallback to Groq
    try {
      console.log("Falling back to Groq...");
      const result = await formatWithGroq(content, customInstructions);
      console.log("Groq succeeded");
      return result;
    } catch (groqError) {
      console.error("Groq also failed:", groqError);
      // Both failed - throw the original OpenAI error
      throw openaiError;
    }
  }
}
