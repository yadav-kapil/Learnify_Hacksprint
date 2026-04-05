import { useState } from "react";
import "./PageTwo.css";
import { GoogleGenAI } from "@google/genai";
import { canAsk, incrementUsage, getRemaining } from '../../utils/apiLimiter';

export default function PageTwo() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  // 🗣️ Speech Function
  const speakText = (text) => {
    if (!window.speechSynthesis) {
      console.error("SpeechSynthesis API not supported.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.05;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      setAnswer("⚠️ Please type a question first!");
      return;
    }

    if (!canAsk()) {
    setError("🚫 Daily limit reached . Try tomorrow!");
    return;
  }

    try {
      setLoading(true);
      setError("");
      setAnswer("");
      setStatus("thinking");

      // 🧠 Generate answer
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Answer clearly, simply, and concisely: ${question}`,
      });

      const answerText =
        response.text?.trim() || "❌ Could not generate an answer. Try again!";

      incrementUsage();
      
      await new Promise((r) => setTimeout(r, 1000));
      setStatus("");

      // ✍️ Typing animation + speaking
      const fullAnswer = "🤖 Learnify says: " + answerText;
      setAnswer("");
      speakText(answerText);

      for (let i = 0; i < fullAnswer.length; i++) {
        await new Promise((r) => setTimeout(r, 20));
        setAnswer((prev) => prev + fullAnswer[i]);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      window.speechSynthesis?.cancel();
      setError("❌ Something went wrong. Try again!");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pageTwoContainer">
      <h1 className="pageTwoTitle">Ask Learnify AI</h1>

      <div className="askSection">
        <h2>Get Instant Answers</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Asking..." : "Ask"}
          </button>
        </form>

        <div className="answerBox">
          {status === "thinking" && (
            <div className="gradientBox">
              <span className="gradientText">🧠 Generating Answer...</span>
            </div>
          )}

          {answer && <p className="typingText">{answer}</p>}

          {error && <div className="errorBox">{error}</div>}
        </div>
      </div>
    </div>
  );
}