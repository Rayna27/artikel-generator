import { useState, useEffect } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<"html" | "text" | false>(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleGenerate = async () => {
    setLoading(true);
    setCopied(false);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });
    const data = await res.json();

    const cleanedHtml = data.article
      .replace(/^```html\s*/i, "")
      .replace(/```$/i, "");

    setOutput(cleanedHtml);
    setLoading(false);
  };

  const handleCopyHTML = () => {
    const el = document.getElementById("article-result");
    if (el) {
      navigator.clipboard.writeText(el.innerHTML).then(() => {
        setCopied("html");
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleCopyText = () => {
    const el = document.getElementById("article-result");
    if (el) {
      navigator.clipboard.writeText(el.innerText).then(() => {
        setCopied("text");
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="p-10 max-w-3xl mx-auto font-sans transition-all duration-300 ease-in-out min-h-screen bg-white text-black dark:bg-gray-950 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">📝 Generator Artikel Otomatis</h1>
        <button
          onClick={() => setIsDark(!isDark)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded hover:opacity-80 transition"
        >
          {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <textarea
        className="w-full border p-4 mb-4 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        placeholder="Masukkan topik artikel kamu..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        rows={3}
      />

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        disabled={loading || !topic.trim()}
      >
        {loading ? "Menulis artikel..." : "🚀 Generate"}
      </button>

      {output && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <button
              onClick={handleCopyHTML}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              📋 Copy HTML
            </button>
            <button
              onClick={handleCopyText}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              📝 Copy Text
            </button>
            {copied === "html" && (
              <span className="text-sm text-green-700 dark:text-green-400 font-medium animate-fade-in-out">
                ✅ HTML tersalin!
              </span>
            )}
            {copied === "text" && (
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium animate-fade-in-out">
                ✅ Teks biasa tersalin!
              </span>
            )}
          </div>

          <div
            id="article-result"
            className="whitespace-pre-wrap border p-6 rounded bg-gray-900 text-white shadow-inner leading-relaxed text-[17px] prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>
      )}
    </div>
  );
}