// CharmsPage.tsx
import NavBar from "../../../components/NavBar";
import { useEffect } from "react";
import Footer from "../../../components/Footer";
import Gallery from "../components/Gallery";
import charms from "../../../content/wiki/charms.json";
import fondo7 from "../../../assets/fondo7.jpg";

const imgs = import.meta.glob("../../../assets/charms/*", { eager: true, as: "url" }) as Record<string,string>;

export default function CharmsPage() {
  useEffect(() => {
    const el = document.getElementById("root") || document.documentElement;
    const prev = el.style.getPropertyValue("--page-bg");
    el.style.setProperty("--page-bg", `url(${fondo7})`);
    return () => {
      if (prev) el.style.setProperty("--page-bg", prev);
      else el.style.removeProperty("--page-bg");
    };
  }, []);

  return (
    <>
      <NavBar />
      <Gallery
        title="Charms"
        backTo={{ href: "/wiki", label: "Back to Wiki" }}
        items={charms as any[]}
        basePath="/wiki/charms"
        assetsGlob={imgs}
        resolveBy="slug"
        showStars={false}   // ⬅️ esconder estrellas
      />
      <Footer />
    </>
  );
}
