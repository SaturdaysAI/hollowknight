import NavBar from "../../../components/NavBar";
import { useEffect } from "react";
import Footer from "../../../components/Footer";
import data from "../../../content/wiki/variants.json";
import Gallery from "../components/Gallery";
import fondo10 from "../../../assets/fondo10.jpg";

const variantImages = import.meta.glob("../../../assets/variants/*", { eager: true, as: "url" }) as Record<string,string>;

export default function VariantsPage() {
  useEffect(() => {
    const el = document.getElementById("root") || document.documentElement;
    const prev = el.style.getPropertyValue("--page-bg");
    el.style.setProperty("--page-bg", `url(${fondo10})`);
    return () => {
      if (prev) el.style.setProperty("--page-bg", prev);
      else el.style.removeProperty("--page-bg");
    };
  }, []);

  return (
    <>
      <NavBar />
      <Gallery
        title="Boss Variants"
        backTo={{ href: "/wiki", label: "BACK TO WIKI" }}
        items={data as any[]}
        basePath="/wiki/variants"
        assetsGlob={variantImages}
        resolveBy="slug"
      />
      <Footer />
    </>
  );
}

