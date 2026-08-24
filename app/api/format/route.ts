import { NextRequest, NextResponse } from "next/server";
import { formatContent } from "@/lib/ai-formatter";
import { convertMarkdownToUnicode } from "@/lib/unicode";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${rateLimit.resetIn} seconds.` },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetIn.toString(),
          }
        }
      );
    }

    const { content, customInstructions } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (content.length > 10000) {
      return NextResponse.json(
        { error: "Content too long (max 10000 characters)" },
        { status: 400 }
      );
    }

    // Get formatted content (OpenAI primary, Groq fallback)
    const formatted = await formatContent(content, customInstructions);

    // Convert markdown bold/italic to Unicode characters
    const unicodeFormatted = convertMarkdownToUnicode(formatted);

    return NextResponse.json({
      formatted: unicodeFormatted,
      charCount: unicodeFormatted.length,
      isOverLimit: unicodeFormatted.length > 3000,
    });
  } catch (error) {
    console.error("Format error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to format content: ${errorMessage}` },
      { status: 500 }
    );
  }
}
