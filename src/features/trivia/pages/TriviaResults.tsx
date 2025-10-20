// src/features/trivia/pages/TriviaResults.tsx
import { useEffect, useMemo } from "react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import { Link } from "react-router-dom";
import fondo6 from "../../../assets/fondo6.jpg";
import brokenGif from "../../../assets/hollow-knight-broken-vessel-gif.gif";
import victoryGif from "../../../assets/victory-gif.gif";

type LastResult = {
  score: number;
  total: number;
  category: string | "all";
  difficulty: 0 | 1 | 2 | 3;
  finishedAt: string; // ISO
};

function formatDifficulty(d: 0 | 1 | 2 | 3) {
  if (d === 0) return "All";
  return d === 1 ? "Easy" : d === 2 ? "Normal" : "Hard";
}

export default function TriviaResults() {
  // Fondo + página estática (sin scroll) mientras está montada
  useEffect(() => {
    const root = document.getElementById("root") || document.documentElement;
    const prevBg = root.style.getPropertyValue("--page-bg");
    root.style.setProperty("--page-bg", `url(${fondo6})`);

    const prevOverflowHtml = document.documentElement.style.overflow;
    const prevOverflowBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      if (prevBg) root.style.setProperty("--page-bg", prevBg);
      else root.style.removeProperty("--page-bg");
      document.documentElement.style.overflow = prevOverflowHtml;
      document.body.style.overflow = prevOverflowBody;
    };
  }, []);

  const last: LastResult | null = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("trivia:last") || "null");
    } catch {
      return null;
    }
  }, []);

  const percent = last ? Math.round((last.score / Math.max(1, last.total)) * 100) : 0;
  const won = last ? last.score > last.total / 2 : false; // strictly more than half to win

  return (
    <>
      <NavBar />

      <main className="container">
        <h2 style={{ fontSize: 32, margin: "12px 0 6px" }}>Results</h2>

        {!last ? (
          <>
            <p className="detail-sub" style={{ marginTop: 6 }}>
              No recent results found. Start a new quiz to see your score here.
            </p>
            <div className="actions" style={{ marginTop: 12 }}>
              <Link to="/trivia" className="btn">START QUIZ</Link>
              <Link to="/" className="btn secondary">BACK TO HOME</Link>
            </div>
          </>
        ) : (
          <>
            {/* Resumen principal */}
            <p className="detail-sub" style={{ marginTop: 6 }}>
              Finished on <time dateTime={last.finishedAt}>{new Date(last.finishedAt).toLocaleString()}</time>
            </p>

            <div
              style={{
                display: "grid",
                gap: 16,
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                marginTop: 10,
              }}
            >
              {/* Score card */}
              <div className="info-card" style={{ background: "var(--btn-bg-2)", border: "1px solid var(--btn-border)", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 className="section-title" style={{ marginTop: 0 }}>SCORE</h3>
                    <p style={{ margin: 0, fontSize: 22 }}>
                      <strong>{last.score}</strong> / {last.total} &nbsp;
                      <span className="detail-sub">({percent}%)</span>
                    </p>
                    <p className="detail-sub" style={{ marginTop: 6 }}>
                      {won
                        ? "Well done, little ghost! Knowledge flows through you."
                        : "Shattered shell, but the will persists. Return stronger."}
                    </p>
                  </div>
                  <img
                    src={won ? victoryGif : brokenGif}
                    alt={won ? "Victory" : "Defeat"}
                    style={{ width: 96, height: 96, objectFit: "contain", borderRadius: 8 }}
                  />
                </div>
              </div>

              {/* Filters card */}
              <div className="info-card" style={{ background: "var(--btn-bg-2)", border: "1px solid var(--btn-border)", borderRadius: 12, padding: 14 }}>
                <h3 className="section-title" style={{ marginTop: 0 }}>FILTERS</h3>
                <dl className="dl-clean">
                  <div className="dl-row" style={{ borderBottom: "none", paddingTop: 0 }}>
                    <dt className="dl-term">Category</dt>
                    <dd className="dl-def">{last.category === "all" ? "All" : last.category}</dd>
                  </div>
                  <div className="dl-row" style={{ borderBottom: "none" }}>
                    <dt className="dl-term">Difficulty</dt>
                    <dd className="dl-def">{formatDifficulty(last.difficulty)}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <hr className="section-divider" />

            <div className="actions">
              <Link to="/trivia" className="btn">Try Again</Link>
              <Link to="/" className="btn secondary">Back to Home</Link>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
