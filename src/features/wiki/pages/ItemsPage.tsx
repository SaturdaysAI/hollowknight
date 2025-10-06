// ItemsPage.tsx
import NavBar from "../../../components/NavBar";
import { useEffect } from "react";
import Footer from "../../../components/Footer";
import Gallery from "../components/Gallery";
import items from "../../../content/wiki/items.json";
import fondo5 from "../../../assets/fondo5.jpg";

const imgs = import.meta.glob("../../../assets/items/*", { eager: true, as: "url" }) as Record<string,string>;

export default function ItemsPage() {
  useEffect(() => {
    const el = document.getElementById("root") || document.documentElement;
    const prev = el.style.getPropertyValue("--page-bg");
    el.style.setProperty("--page-bg", `url(${fondo5})`);
    return () => {
      if (prev) el.style.setProperty("--page-bg", prev);
      else el.style.removeProperty("--page-bg");
    };
  }, []);

  return (
    <>
      <NavBar />
      <Gallery
        title="Items"
        backTo={{ href: "/wiki", label: "Back to Wiki" }}
        items={items as any[]}
        basePath="/wiki/items"
        assetsGlob={imgs}
        resolveBy="slug"
        showStars={false}   // ⬅️ esconder estrellas
      />
      <Footer />
    </>
  );
}
