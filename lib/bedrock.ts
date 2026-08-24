import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-west-2",
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

Respond ONLY with the formatted post, nothing else.`;

export async function formatWithClaude(content: string): Promise<string> {
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Format this content for LinkedIn:\n\n${content}`,
      },
    ],
  };

  const command = new InvokeModelCommand({
    modelId: "us.anthropic.claude-sonnet-4-20250514-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  return responseBody.content[0].text;
}
