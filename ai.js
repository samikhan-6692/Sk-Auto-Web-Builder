/* ============ AI CONFIG (keys lagao) ============ */
// Google Gemini (free quota): https://aistudio.google.com
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
// HuggingFace (free rate-limited): https://huggingface.co/settings/tokens
const HF_API_KEY = "YOUR_HF_API_KEY";

/* ============ Helpers ============ */
function setLoading(isLoading) {
  const btn = document.getElementById("aiRunBtn");
  const spinner = document.getElementById("aiSpinner");
  if (btn) btn.disabled = isLoading;
  if (spinner) spinner.style.display = isLoading ? "inline-block" : "none";
}
function putOutput(text) {
  const out = document.getElementById("aiOutput");
  if (out) out.value = text;
}
function safe(val, fallback = "No response") {
  return val ?? fallback;
}

/* ============ Gemini (text) ============ */
async function geminiAI(prompt) {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }]}]
      })
    }
  );
  const data = await res.json();
  return safe(
    data?.candidates?.[0]?.content?.parts?.[0]?.text
  );
}

/* ============ HuggingFace (code-ish) ============ */
async function huggingFaceAI(prompt) {
  const res = await fetch("https://api-inference.huggingface.co/models/gpt2", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + HF_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: prompt })
  });
  const data = await res.json();
  // gpt2 style response
  if (Array.isArray(data) && data[0]?.generated_text) return data[0].generated_text;
  return JSON.stringify(data);
}

/* ============ Modes ============ */
async function runAI(mode, userPrompt) {
  if (!userPrompt || !userPrompt.trim()) {
    alert("Please type your idea / prompt first.");
    return;
  }
  setLoading(true);
  putOutput("");

  try {
    let result = "";
    if (mode === "chat") {
      result = await geminiAI(userPrompt);
    } else if (mode === "web") {
      // ask AI for full HTML (inline CSS + minimal JS)
      const prompt = `Create a COMPLETE, single-file responsive HTML page.
Include <html>, <head> with <style>, and <body>. Keep it clean, mobile-first.
User request: ${userPrompt}`;
      result = await geminiAI(prompt);
    } else if (mode === "app") {
      // small JS app skeleton (HF used here for variety)
      const prompt = `Generate a minimal vanilla JS single-file app.
Return ONLY code (HTML with <script> inside). Feature set: ${userPrompt}`;
      result = await huggingFaceAI(prompt);
    } else {
      result = "Invalid mode.";
    }

    putOutput(result);
    // auto-preview if it's HTML-ish
    autoPreviewIfHTML(result);

  } catch (e) {
    putOutput("Error: " + e.message);
  } finally {
    setLoading(false);
  }
}

/* ============ Preview ============ */
function isLikelyHTML(str) {
  return /<html[\s>]|<body[\s>]|<div[\s>]|<section[\s>]/i.test(str);
}

function autoPreviewIfHTML(text) {
  if (!isLikelyHTML(text)) return;
  const iframe = document.getElementById("aiPreview");
  if (!iframe) return;
  const blob = new Blob([text], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  iframe.src = url;
}

function previewOutput() {
  const text = document.getElementById("aiOutput")?.value || "";
  autoPreviewIfHTML(text);
}

window.runAI = runAI;          // expose to HTML
window.previewOutput = previewOutput;