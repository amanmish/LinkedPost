// Simple in-memory rate limiter
// Tracks requests per IP using a sliding window approach

interface RateLimitEntry {
  count: number;
  firstRequestTime: number;
}

// Store: IP -> { count, firstRequestTime }
const requestMap = new Map<string, RateLimitEntry>();

// Configuration
const WINDOW_MS = 60 * 1000;  // 1 minute window
const MAX_REQUESTS = 10;       // Max 10 requests per window

// Cleanup old entries every 5 minutes to prevent memory bloat
const CLEANUP_INTERVAL = 5 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requestMap.entries()) {
    if (now - entry.firstRequestTime > WINDOW_MS) {
      requestMap.delete(ip);
    }
  }
}, CLEANUP_INTERVAL);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = requestMap.get(ip);

  // No previous requests from this IP
  if (!entry) {
    requestMap.set(ip, { count: 1, firstRequestTime: now });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetIn: 60 };
  }

  // Window expired - reset the counter
  if (now - entry.firstRequestTime > WINDOW_MS) {
    requestMap.set(ip, { count: 1, firstRequestTime: now });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetIn: 60 };
  }

  // Within window - check limit
  if (entry.count >= MAX_REQUESTS) {
    const resetIn = Math.ceil((WINDOW_MS - (now - entry.firstRequestTime)) / 1000);
    return { allowed: false, remaining: 0, resetIn };
  }

  // Increment counter
  entry.count++;
  const resetIn = Math.ceil((WINDOW_MS - (now - entry.firstRequestTime)) / 1000);
  return { allowed: true, remaining: MAX_REQUESTS - entry.count, resetIn };
}
