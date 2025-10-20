import { useEffect } from "react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import { Link } from "react-router-dom";
import hkVideo from "../../../assets/hollow-knight-wallpaper.mp4";
import logo from "../../../assets/logo.png";
import SearchBar from "../../../components/SearchBar";
import icon1 from "../../../assets/icon1.jpg";

export default function Home() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const bgStyle: React.CSSProperties = {
    position: "relative",
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    backgroundColor: "var(--footer-bg)",
    overflow: "hidden",
  };

  return (
    <>
      <NavBar />
      <main style={bgStyle}>
        {/* Video de fondo animado */}
        <video
          className="home-bg-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={hkVideo} type="video/mp4" />
        </video>
        <div className="container-left">
          <div className="hero">
            <img src={logo} alt="Hollow Knight" className="hero-logo" loading="eager" />

            <p className="hero-text">
              Fan-made Hollow Knight wiki + trivia. Explore areas, bosses, charms, items, variants and warrior dreams.
              Interactive world map, summaries, acquisition notes and lore — then put your knowledge to the test.
            </p>
            <img
              src={icon1}
              alt="Hollow Knight emblem"
              className="hero-icon"
              loading="lazy"
            />
            <SearchBar />
            <div className="actions center">
              <Link to="/wiki" className="btn">GO TO WIKI</Link>
              <Link to="/trivia" className="btn secondary">PLAY TRIVIA</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
