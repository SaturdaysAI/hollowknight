import { useEffect } from "react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import { Link } from "react-router-dom";
import fondo1 from "../../../assets/fondo1.jpg";
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
    backgroundImage: `url(${fondo1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    backgroundColor: "var(--footer-bg)",
  };

  return (
    <>
      <NavBar />
      <main style={bgStyle}>
        <div className="container-left">
          <div className="hero">
            <img src={logo} alt="Hollow Knight" className="hero-logo" loading="eager" />

            <p className="hero-text">
              Fan-made Hollow Knight wiki + trivia. Quick guides to areas, bosses, charms, lore,
              and spoiler-tagged endings — then put your knowledge to the test.
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
