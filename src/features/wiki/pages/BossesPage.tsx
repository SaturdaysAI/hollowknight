import NavBar from "../../../components/NavBar";
import { useEffect } from "react";
import Footer from "../../../components/Footer";
import data from "../../../content/wiki/bosses.json";
import Gallery from "../components/Gallery";
import fondo3 from "../../../assets/fondo3.jpg";

const bossImages = import.meta.glob("../../../assets/bosses/*", { eager: true, as: "url" }) as Record<string,string>;

export default function BossesPage() {
  useEffect(() => {
    const el = document.getElementById("root") || document.documentElement;
    const prev = el.style.getPropertyValue("--page-bg");
    el.style.setProperty("--page-bg", `url(${fondo3})`);
    return () => {
      if (prev) el.style.setProperty("--page-bg", prev);
      else el.style.removeProperty("--page-bg");
    };
  }, []);

  return (
    <>
      <NavBar />
      <Gallery
        title="Bosses"
        backTo={{ href: "/wiki", label: "BACK TO WIKI" }}
        items={data as any[]}
        basePath="/wiki/bosses"
        assetsGlob={bossImages}
        resolveBy="slug"
      />
      <Footer />
    </>
  );
}

