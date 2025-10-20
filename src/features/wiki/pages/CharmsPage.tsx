// CharmsPage.tsx
import NavBar from "../../../components/NavBar";
import { useEffect } from "react";
import Footer from "../../../components/Footer";
import Gallery from "../components/Gallery";
import charms from "../../../content/wiki/charms.json";
import fondoCharms from "../../../assets/fondo-charms.png";

const imgs = import.meta.glob("../../../assets/charms/*", { eager: true, as: "url" }) as Record<string,string>;

export default function CharmsPage() {
  useEffect(() => {
    const el = document.getElementById("root") || document.documentElement;
    const prev = el.style.getPropertyValue("--page-bg");
    el.style.setProperty("--page-bg", `url(${fondoCharms})`);
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
        backTo={{ href: "/wiki", label: "BACK TO WIKI" }}
        items={(charms as any[]).map((it) => ({ ...it, notches: notchMap[it.slug] ?? (it as any).notches, }))}
        basePath="/wiki/charms"
        assetsGlob={imgs}
        resolveBy="slug"
        showStars={false}   // ⬅️ esconder estrellas
      />
      <Footer />
    </>
  );
}

// Mapa de muescas por charm
const notchMap: Record<string, number> = {
  // 1 muesca
  "wayward-compass": 1,
  "gathering-swarm": 1,
  "sprintmaster": 1,
  "grubsong": 1,
  "fury-of-the-fallen": 1,
  "thorns-of-agony": 1,
  "defenders-crest": 1,
  "steady-body": 1,
  "spore-shroom": 1,
  "nailmasters-glory": 1,
  "dream-wielder": 1,
  // 2 muescas
  "stalwart-shell": 2,
  "soul-catcher": 2,
  "dashmaster": 2,
  "longnail": 2,
  "baldur-shell": 2,
  "glowing-womb": 2,
  "spell-twister": 2,
  "heavy-blow": 2,
  "sharp-shadow": 2,
  "weaversong": 2,
  "lifeblood-heart": 2,
  "fragile-heart": 2,
  "unbreakable-heart": 2,
  "fragile-greed": 2,
  "unbreakable-greed": 2,
  "grimmchild": 2,
  "shape-of-unn": 2,
  // 3 muescas
  "fragile-strength": 3,
  "unbreakable-strength": 3,
  "shaman-stone": 3,
  "quick-slash": 3,
  "mark-of-pride": 3,
  "grubberflys-elegy": 3,
  "flukenest": 3,
  "quick-focus": 3,
  "dreamshield": 3,
  "carefree-melody": 3,
  "lifeblood-core": 3,
  // 4 muescas
  "soul-eater": 4,
  "deep-focus": 4,
  "jonis-blessing": 4,
  "hiveblood": 4,
  // 5 muescas
  "kingsoul": 5,
};
