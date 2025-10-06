import NavBar from "../../../components/NavBar";
import { useEffect } from "react";
import Footer from "../../../components/Footer";
import data from "../../../content/wiki/warrior-dreams.json";
import Gallery from "../components/Gallery";
import fondo2 from "../../../assets/fondo2.jpg";

const wdImages = import.meta.glob("../../../assets/warrior-dreams/*", { eager: true, as: "url" }) as Record<string,string>;

export default function WarriorDreamsPage() {
  useEffect(() => {
    const el = document.getElementById("root") || document.documentElement;
    const prev = el.style.getPropertyValue("--page-bg");
    el.style.setProperty("--page-bg", `url(${fondo2})`);
    return () => {
      if (prev) el.style.setProperty("--page-bg", prev);
      else el.style.removeProperty("--page-bg");
    };
  }, []);

  return (
    <>
      <NavBar />
      <Gallery
        title="Warrior Dreams"
        backTo={{ href: "/wiki", label: "← Back to Wiki" }}
        items={data as any[]}
        basePath="/wiki/warrior-dreams"
        assetsGlob={wdImages}
        resolveBy="slug"
      />
      <Footer />
    </>
  );
}
