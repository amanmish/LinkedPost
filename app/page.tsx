"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [showCustomize, setShowCustomize] = useState(false);
  const [output, setOutput] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleFormat = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input, customInstructions: customInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to format");
      }

      setOutput(data.formatted);
      setCharCount(data.charCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard");
    }
  };

  const handleClear = () => {
    setInput("");
    setCustomInput("");
    setOutput("");
    setCharCount(0);
    setError("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2">
            <span className="text-blue-600">Linked</span>Post
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Transform your content into LinkedIn-ready posts in seconds
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
            Your Content
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your raw content here... It can be messy, unstructured, or just rough ideas. We'll transform it into a polished LinkedIn post."
            className="w-full h-40 sm:h-48 p-4 border border-slate-200 dark:border-slate-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base"
          />

          {/* Customize Section */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowCustomize(!showCustomize)}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <span className={`transform transition-transform ${showCustomize ? 'rotate-90' : ''}`}>
                ▸
              </span>
              Customize (optional)
            </button>

            {showCustomize && (
              <div className="mt-3 animate-fade-in">
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder='e.g. "make it shorter", "no emojis", "more professional", "add CTA about my ebook", "punchy tone"...'
                  className="w-full h-20 p-3 border border-slate-200 dark:border-slate-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={handleFormat}
              disabled={isLoading || !input.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Formatting...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Format for LinkedIn
                </>
              )}
            </button>
            {input && (
              <button
                onClick={handleClear}
                className="px-6 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Output Section */}
        {output && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 sm:p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Your LinkedIn Post
              </label>
              <span
                className={`text-sm font-medium ${
                  charCount > 3000
                    ? "text-red-500"
                    : charCount > 2700
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {charCount.toLocaleString()} / 3,000
              </span>
            </div>
            <div className="relative">
              <div className="w-full min-h-[200px] p-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm sm:text-base whitespace-pre-wrap break-words">
                {output}
              </div>
            </div>
            <button
              onClick={handleCopy}
              className={`mt-4 w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-slate-800 dark:bg-slate-600 hover:bg-slate-700 dark:hover:bg-slate-500 text-white"
              }`}
            >
              {copied ? (
                <>
                  <span>✓</span>
                  Copied!
                </>
              ) : (
                <>
                  <span>📋</span>
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
        )}

        {/* Features */}
        {!output && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">✨</div>
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
                AI-Powered
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Smart formatting that understands context
              </p>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
                One-Click Copy
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Bold & formatting preserved
              </p>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
                Mobile Ready
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Works perfectly on any device
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-slate-400 dark:text-slate-500 text-xs">
          Made with ❤️ for LinkedIn creators
        </footer>
      </div>
    </main>
  );
}
