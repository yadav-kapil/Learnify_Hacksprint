import { useState, useRef, useEffect } from "react";
import "./Practice.css";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function Practice() {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [animatedAnswer, setAnimatedAnswer] = useState("");
  const [qLoading, setQLoading] = useState(false);
  const [aLoading, setALoading] = useState(false);
  const [status, setStatus] = useState("");
  const [answered, setAnswered] = useState(false);
  const [visibleLeft, setVisibleLeft] = useState(false);
  const [visibleRight, setVisibleRight] = useState(false);

  const answerBoxRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  // 🎤 Speech
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  // Fade animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === leftRef.current && entry.isIntersecting)
            setVisibleLeft(true);
          if (entry.target === rightRef.current && entry.isIntersecting)
            setVisibleRight(true);
        });
      },
      { threshold: 0.2 }
    );

    if (leftRef.current) observer.observe(leftRef.current);
    if (rightRef.current) observer.observe(rightRef.current);

    return () => {
      if (leftRef.current) observer.unobserve(leftRef.current);
      if (rightRef.current) observer.unobserve(rightRef.current);
    };
  }, []);

  // 🧠 Question
  const handleGetQuestion = async () => {
    if (!topic.trim()) {
      setDisplayedQuestion("⚠️ Please enter a topic first!");
      return;
    }

    setQLoading(true);
    setDisplayedQuestion("");
    setAnswered(false);

    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate one short educational practice question about ${topic}.`,
      });

      const fullQ = (res.text || "❌ No question generated.").trim();
      setQuestion(fullQ);

      for (let i = 0; i < fullQ.length; i++) {
        setDisplayedQuestion((prev) => prev + fullQ[i]);
        await new Promise((r) => setTimeout(r, 25));
      }

      speakText(fullQ);
    } catch {
      setDisplayedQuestion("❌ Something went wrong. Try again!");
    } finally {
      setQLoading(false);
    }
  };

  // 🤖 Answer
  const handleGetAnswer = async () => {
    if (!question || question.startsWith("⚠️") || question.startsWith("⏳"))
      return;

    setALoading(true);
    setAnimatedAnswer("");
    setAnswered(true);

    try {
      setStatus("🧠 Generating Answer...");
      await new Promise((r) => setTimeout(r, 1000));

      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Explain Answer clearly, simply and briefly for the question : ${question}`,
      });

      const cleanText = res.text
        .replace(/\*/g, "*")
        .replace(/\$/g, "$")
        .replace(/\\text\{(.*?)\}/g, "$1")
        .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, "$1/$2")
        .trim();

      setStatus("");

      speakText(cleanText);

      for (let i = 0; i < cleanText.length; i++) {
        setAnimatedAnswer((prev) => prev + cleanText[i]);
        await new Promise((r) => setTimeout(r, 20));
        if (answerBoxRef.current) {
          answerBoxRef.current.scrollTop =
            answerBoxRef.current.scrollHeight;
        }
      }
    } catch {
      setStatus("");
    } finally {
      setALoading(false);
    }
  };

  return (
    <div className="practice">
      <div className="title">
        <h1>Practice Mode</h1>
      </div>

      {/* LEFT SIDE */}
      <div
        ref={leftRef}
        className={`left fade-in-left ${visibleLeft ? "visible" : ""}`}
      >
        <div className="inputBar">
          <input
            type="text"
            placeholder="Enter topic to practice..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button onClick={handleGetQuestion} disabled={qLoading}>
            {qLoading ? "Loading..." : "Get Question"}
          </button>
        </div>

        <div className="questionBox">
          {qLoading ? (
            <p className="gradientText">🧠 Generating Question...</p>
          ) : (
            <ReactMarkdown
              children={
                displayedQuestion || "🧩 Choose a topic to generate a question!"
              }
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            />
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        ref={rightRef}
        className={`right fade-in-right ${visibleRight ? "visible" : ""}`}
      >
        <div className="answerBox" ref={answerBoxRef}>
          {status && (
            <div className="statusBox">
              <p className="gradientText">{status}</p>
            </div>
          )}

          <ReactMarkdown
            children={animatedAnswer}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          />
        </div>
      </div>

      {/* BUTTON */}
      <button
        className="ansBtn"
        onClick={handleGetAnswer}
        disabled={
          !question ||
          qLoading ||
          aLoading ||
          answered ||
          question.startsWith("⚠️") ||
          question.startsWith("⏳")
        }
      >
        {aLoading ? "Getting Answer..." : answered ? "Answered" : "GET ANSWER"}
      </button>
    </div>
  );
}