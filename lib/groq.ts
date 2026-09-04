import OpenAI from "openai";

// Groq uses OpenAI-compatible API
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `You are a LinkedIn content formatter. Your job is to take raw content and transform it into an engaging, professional LinkedIn post.

RULES:
1. Keep the creator's voice and message intact - don't change the meaning
2. Use **bold** for key phrases that deserve emphasis (2-4 per post max)
3. Use *italic* sparingly for softer emphasis
4. Add relevant emojis where natural (don't overdo it - 3-6 per post)
5. Structure with proper line breaks for readability (LinkedIn needs blank lines for spacing)
6. Keep under 3000 characters
7. End with 3-5 relevant hashtags on a new line
8. Use short paragraphs (1-3 sentences max)
9. Add a hook at the start to grab attention
10. Include a clear call-to-action or thought-provoking question at the end

FORMAT OUTPUT AS:
- Use markdown **bold** and *italic* syntax
- Use double line breaks between paragraphs
- Put hashtags at the very end, separated by spaces

DO NOT:
- Add fake statistics or claims
- Change the core message
- Make it sound generic or salesy
- Use corporate jargon
- Over-emoji (keep it professional)
- Use code blocks (\`\`\`) or inline code formatting - LinkedIn doesn't support it
- Use separators like "---", "___", or "***"

For code, APIs, or technical content, write it as plain text without special formatting.

Respond ONLY with the formatted post, nothing else.`;

export async function formatWithGroq(content: string, customInstructions?: string): Promise<string> {
  let userMessage = `Format this content for LinkedIn:\n\n${content}`;

  if (customInstructions?.trim()) {
    userMessage += `\n\n---\nADDITIONAL INSTRUCTIONS FROM CREATOR:\n${customInstructions}`;
  }

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    max_tokens: 2000,
    temperature: 0.7,
  });

  return response.choices[0].message.content || "";
}
