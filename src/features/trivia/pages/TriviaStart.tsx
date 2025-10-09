// src/features/trivia/pages/TriviaStart.tsx
import { useEffect, useMemo, useState } from "react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import type { TriviaQuestion, TriviaCategory } from "./types";
import rawQuestions from "../../../content/trivia/questions.json";
import fondo6 from "../../../assets/fondo6.jpg";

// Fisher–Yates
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Categorías únicas
const ALL_CATEGORIES: TriviaCategory[] = Array.from(
  new Set((rawQuestions as TriviaQuestion[]).map((q) => q.category))
).sort() as TriviaCategory[];

// Píldoras de dificultad
const DIFF_PILLS = [
  { label: "ALL", value: 0 as 0 | 1 | 2 | 3 },
  { label: "EASY", value: 1 as 0 | 1 | 2 | 3 },
  { label: "NORMAL", value: 2 as 0 | 1 | 2 | 3 },
  { label: "HARD", value: 3 as 0 | 1 | 2 | 3 },
];

export default function TriviaStart() {
  const navigate = useNavigate();

  // ====== Config ======
  const [selectedCat, setSelectedCat] = useState<TriviaCategory | "all">("all");
  const [selectedDiff, setSelectedDiff] = useState<0 | 1 | 2 | 3>(0);
  const [numQuestions, setNumQuestions] = useState<number>(10);

  // ====== Juego ======
  const [started, setStarted] = useState(false);
  const [deck, setDeck] = useState<TriviaQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  // Fondo + control de scroll: móvil -> scroll libre; escritorio -> fijo como antes
  useEffect(() => {
    const root = document.getElementById("root") || document.documentElement;
    const prevBg = root.style.getPropertyValue("--page-bg");
    root.style.setProperty("--page-bg", `url(${fondo6})`);

    const prevOverflowHtml = document.documentElement.style.overflow;
    const prevOverflowBody = document.body.style.overflow;

    const applyOverflow = () => {
      // “móvil” si tiene puntero táctil o el ancho es <= 768
      const isMobile = window.matchMedia("(pointer: coarse), (max-width: 768px)").matches;
      if (isMobile) {
        document.documentElement.style.overflow = "auto";
        document.body.style.overflow = "auto";
      } else {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      }
    };

    applyOverflow();
    window.addEventListener("resize", applyOverflow);

    return () => {
      if (prevBg) root.style.setProperty("--page-bg", prevBg);
      else root.style.removeProperty("--page-bg");
      document.documentElement.style.overflow = prevOverflowHtml;
      document.body.style.overflow = prevOverflowBody;
      window.removeEventListener("resize", applyOverflow);
    };
  }, []);

  // Filtrado por selección
  const filtered = useMemo(() => {
    let data = rawQuestions as TriviaQuestion[];
    if (selectedCat !== "all") data = data.filter((q) => q.category === selectedCat);
    if (selectedDiff !== 0) data = data.filter((q) => q.difficulty === selectedDiff);
    return data;
  }, [selectedCat, selectedDiff]);

  // Ajusta el tope al disponible
  useEffect(() => {
    if (filtered.length < numQuestions) {
      setNumQuestions(Math.max(1, filtered.length));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length]);

  // Iniciar partida (con respuestas aleatorias por pregunta)
  const handleStart = () => {
    const pool = shuffle(filtered).slice(0, Math.max(1, numQuestions));
    const prepared: TriviaQuestion[] = pool.map((q) => {
      const order = shuffle([...q.choices].map((_, i) => i));
      const shuffledChoices = order.map((i) => q.choices[i]);
      const newAnswerIndex = order.indexOf(q.answerIndex);
      return { ...q, choices: shuffledChoices, answerIndex: newAnswerIndex };
    });

    setDeck(prepared);
    setIndex(0);
    setPicked(null);
    setIsCorrect(null);
    setScore(0);
    setStarted(true);
  };

  // Responder
  const handlePick = (choiceIndex: number) => {
    if (picked !== null) return;
    setPicked(choiceIndex);
    const ok = choiceIndex === deck[index].answerIndex;
    setIsCorrect(ok);
    if (ok) setScore((s) => s + 1);
  };

  // Siguiente / Final
  const handleNext = () => {
    if (index + 1 < deck.length) {
      setIndex((i) => i + 1);
      setPicked(null);
      setIsCorrect(null);
    } else {
      const payload = {
        score,
        total: deck.length,
        category: selectedCat,
        difficulty: selectedDiff,
        finishedAt: new Date().toISOString(),
      };
      sessionStorage.setItem("trivia:last", JSON.stringify(payload));
      navigate("/trivia/results");
    }
  };

  // Atajos
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started) return;
      if (e.key >= "1" && e.key <= "4") {
        const idx = Number(e.key) - 1;
        if (deck[index]?.choices[idx] !== undefined) handlePick(idx);
      }
      if (e.key === "Enter" && picked !== null) handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, deck, index, picked]);

  return (
    <>
      <NavBar />

      <main className="container">
        {!started ? (
          <div className="trivia-shell">
            <section className="trivia-panel trivia-panel--wide">
              <h1 className="trivia-title">HOLLOW KNIGHT — TRIVIA</h1>
              <p className="trivia-sub">
                PICK A CATEGORY, TUNE DIFFICULTY, CHOOSE HOW MANY QUESTIONS… AND BEGIN.
              </p>

              {/* CATEGORY */}
              <div className="control-block">
                <h3 className="control-heading">CATEGORY</h3>
                <div className="pill-grid pill-grid--roomy">
                  <button
                    type="button"
                    className={`toggle-card ${selectedCat === "all" ? "is-active" : ""}`}
                    onClick={() => setSelectedCat("all")}
                  >
                    ALL
                  </button>
                  {ALL_CATEGORIES.map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={`toggle-card ${selectedCat === c ? "is-active" : ""}`}
                      onClick={() => setSelectedCat(c)}
                    >
                      {c.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* DIFFICULTY */}
              <div className="control-block">
                <h3 className="control-heading">DIFFICULTY</h3>
                <div className="pill-grid pill-grid--roomy">
                  {DIFF_PILLS.map((d) => (
                    <button
                      type="button"
                      key={d.value}
                      className={`toggle-card ${selectedDiff === d.value ? "is-active" : ""}`}
                      onClick={() => setSelectedDiff(d.value)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUESTIONS (un solo recuadro) */}
              <div className="control-block">
                <h3 className="control-heading">
                  QUESTIONS <span className="count-pill">{filtered.length} AVAILABLE</span>
                </h3>

                <div className="qty-single">
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, filtered.length)}
                    value={numQuestions}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      const safe = Number.isFinite(next) ? next : 1;
                      setNumQuestions(Math.max(1, Math.min(safe, filtered.length)));
                    }}
                  />
                  <span className="qty-note">MAX: {filtered.length}</span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="trivia-actions">
                <button
                  className="btn start-btn"
                  onClick={handleStart}
                  disabled={filtered.length === 0}
                >
                  START QUIZ
                </button>
                <Link to="/trivia/results" className="btn secondary">
                  LAST RESULTS
                </Link>
              </div>

              {filtered.length === 0 && (
                <p className="detail-sub" style={{ marginTop: 10 }}>
                  NO QUESTIONS MATCH THE SELECTED FILTERS. TRY CHANGING CATEGORY/DIFFICULTY.
                </p>
              )}
            </section>
          </div>
        ) : (
          <>
            {/* Header de progreso */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <p className="detail-sub" style={{ margin: 0 }}>
                <strong>{index + 1}</strong> / {deck.length} &middot; SCORE:{" "}
                <strong>{score}</strong>
              </p>
              <button className="btn secondary" onClick={() => setStarted(false)}>
                RESTART
              </button>
            </div>
            <hr className="section-divider" />

            {/* Pregunta + opciones */}
            {deck[index] && (
              <>
                <h2 style={{ fontSize: 24, margin: "0 0 12px" }}>{deck[index].question}</h2>
                {deck[index].link && (
                  <p className="detail-sub" style={{ marginTop: -6, marginBottom: 12 }}>
                  </p>
                )}
                
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 12px",
                    display: "grid",
                    gap: 10,
                  }}
                >
                  {deck[index].choices.map((choice, i) => {
                    const chosen = picked === i;
                    const showState = picked !== null;
                    const isRight = i === deck[index].answerIndex;

                    let bg = "var(--btn-bg)";
                    let br = "1px solid var(--btn-border)";
                    let glow = "none";
                    if (showState) {
                      if (isRight) {
                        bg = "#1f3a2e";
                        br = "1px solid #38ecb055";
                        glow = "0 6px 18px rgba(56,236,176,.18)";
                      } else if (chosen) {
                        bg = "#3a1f2a";
                        br = "1px solid #ff7a7a55";
                        glow = "0 6px 18px rgba(255,122,122,.18)";
                      }
                    }

                    return (
                      <li key={i}>
                        <button
                          className="btn"
                          onClick={() => handlePick(i)}
                          disabled={picked !== null}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            background: bg,
                            border: br,
                            boxShadow: glow,
                          }}
                        >
                          <span style={{ opacity: 0.85, marginRight: 8 }}>{i + 1}.</span>{" "}
                          {choice}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {picked !== null && deck[index].explain && (
                  <p className="detail-sub" style={{ marginTop: 8 }}>
                    {isCorrect ? "CORRECT." : "NOT QUITE."} {deck[index].explain}
                  </p>
                )}

                <div className="actions">
                  <button className="btn" onClick={handleNext} disabled={picked === null}>
                    {index + 1 < deck.length ? "NEXT" : "FINISH"}
                  </button>
                  <Link to="/trivia/results" className="btn secondary">
                    SKIP TO THE LAST RESULTS
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Footer fijo para que siempre sea visible */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 10 }}>
        <Footer />
      </div>
    </>
  );
}
