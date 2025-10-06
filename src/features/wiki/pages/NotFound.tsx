import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <NavBar />
      <main className="container">
        <h1 style={{fontSize:"32px", margin:"16px 0"}}>404 — PAGE NOT FOUND</h1>
        <p>GO TO THE <Link to="/">MENU</Link>.</p>
      </main>
      <Footer />
    </>
  );
}
