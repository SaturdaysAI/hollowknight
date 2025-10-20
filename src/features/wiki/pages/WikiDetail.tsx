import NavBar from "../../../components/NavBar";
import { useEffect } from "react";
import Footer from "../../../components/Footer";
import { Link, useParams } from "react-router-dom";
import fondo2 from "../../../assets/fondo2.jpg";
import fondo3 from "../../../assets/fondo3.jpg";
import fondo5 from "../../../assets/fondo5.jpg";
import fondoCharms from "../../../assets/fondo-charms.png";
import fondo10 from "../../../assets/fondo10.jpg";

import bosses   from "../../../content/wiki/bosses.json";
import dreams   from "../../../content/wiki/warrior-dreams.json";
import variants from "../../../content/wiki/variants.json";
import charms   from "../../../content/wiki/charms.json";
import items    from "../../../content/wiki/items.json";

const imgsBosses    = import.meta.glob("../../../assets/bosses/*",          { eager: true, as: "url" }) as Record<string,string>;
const imgsDreams    = import.meta.glob("../../../assets/warrior-dreams/*",  { eager: true, as: "url" }) as Record<string,string>;
const imgsVariants  = import.meta.glob("../../../assets/variants/*",        { eager: true, as: "url" }) as Record<string,string>;
const imgsCharms    = import.meta.glob("../../../assets/charms/*",          { eager: true, as: "url" }) as Record<string,string>;
const imgsItems     = import.meta.glob("../../../assets/items/*",           { eager: true, as: "url" }) as Record<string,string>;

const MAP = {
  bosses:           { data: bosses as any[],   imgs: imgsBosses,   back: "/wiki/bosses",          label: "Bosses" },
  "warrior-dreams": { data: dreams as any[],   imgs: imgsDreams,   back: "/wiki/warrior-dreams",  label: "Warrior Dreams" },
  variants:         { data: variants as any[], imgs: imgsVariants, back: "/wiki/variants",        label: "Boss Variants" },
  charms:           { data: charms as any[],   imgs: imgsCharms,   back: "/wiki/charms",          label: "Charms" },
  items:            { data: items as any[],    imgs: imgsItems,    back: "/wiki/items",           label: "Items" }
} as const;

// Stars (1–5)
function Stars({ n = 0 }: { n?: number }) {
  const safe = Math.max(0, Math.min(5, Number.isFinite(n as number) ? (n as number) : 0));
  return (
    <span className="gallery-stars" aria-label={`${safe} out of 5`} title={`${safe} / 5`}>
      {"\u2605".repeat(safe)}
      {"\u2606".repeat(5 - safe)}
    </span>
  );
}

// Notches (circles)
function Notches({ n = 0 }: { n?: number }) {
  const count = Math.max(0, Math.min(10, Number.isFinite(n as number) ? (n as number) : 0));
  return (
    <span className="notches" aria-label={`${count} notches`} title={`${count} notches`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="notch" />
      ))}
      {count === 0 && <span className="notch notch--zero">0</span>}
    </span>
  );
}

// Notches map for charms
const notchMap: Record<string, number> = {
  "wayward-compass":1, "gathering-swarm":1, "sprintmaster":1, "grubsong":1,
  "fury-of-the-fallen":1, "thorns-of-agony":1, "defenders-crest":1, "steady-body":1,
  "spore-shroom":1, "nailmasters-glory":1, "dream-wielder":1,
  "stalwart-shell":2, "soul-catcher":2, "dashmaster":2, "longnail":2,
  "baldur-shell":2, "glowing-womb":2, "spell-twister":2, "heavy-blow":2,
  "sharp-shadow":2, "weaversong":2, "lifeblood-heart":2,
  "fragile-heart":2, "unbreakable-heart":2, "fragile-greed":2, "unbreakable-greed":2,
  "grimmchild":2, "shape-of-unn":2,
  "fragile-strength":3, "unbreakable-strength":3,
  "shaman-stone":3, "quick-slash":3, "mark-of-pride":3, "grubberflys-elegy":3,
  "flukenest":3, "quick-focus":3, "dreamshield":3, "carefree-melody":3, "lifeblood-core":3,
  "soul-eater":4, "deep-focus":4, "jonis-blessing":4, "hiveblood":4,
  "kingsoul":5
};

export default function WikiDetail() {
  const { group = "", slug = "" } = useParams();
  const pack = MAP[group as keyof typeof MAP];
  const item = pack?.data.find((i) => i.slug === slug);
  const entries = pack ? Object.entries(pack.imgs) : [];

  // Apply the same background as the section list pages
  useEffect(() => {
    const backgrounds: Record<string, string> = {
      bosses: fondo3,
      "warrior-dreams": fondo2,
      variants: fondo10,
      charms: fondoCharms,
      items: fondo5,
    };
    const el = document.getElementById("root") || document.documentElement;
    const prev = el.style.getPropertyValue("--page-bg");
    const chosen = backgrounds[group] as string | undefined;
    if (chosen) el.style.setProperty("--page-bg", `url(${chosen})`);
    return () => {
      if (prev) el.style.setProperty("--page-bg", prev);
      else el.style.removeProperty("--page-bg");
    };
  }, [group]);

  const imgUrl =
    entries.find(([p]) =>
      p.endsWith(`/${slug}.jpg`) || p.endsWith(`/${slug}.png`) || p.endsWith(`/${slug}.webp`)
    )?.[1] ?? "";

  const showStars = typeof (item as any)?.difficulty === "number" && Number.isFinite((item as any)?.difficulty);
  const summary = (item as any)?.summary?.trim() || "";
  const overviewText = (item as any)?.overview?.trim?.() || (item as any)?.overview || "";
  const obtain = (item as any)?.obtain?.trim?.() || (item as any)?.obtain || "";
  const computedNotches = group === "charms" ? (notchMap as any)[slug] ?? (item as any)?.notches : undefined;
  const isItems = group === "items";
  const isCharms = group === "charms";
  const isCombat = group === "bosses" || group === "warrior-dreams" || group === "variants";
  const hasEffect = isItems || isCharms;
  const effectText = hasEffect ? ((item as any)?.effect?.trim?.() || (item as any)?.effect || "") : "";
  const sellGeo = isItems && typeof (item as any)?.sellGeo === "number" ? (item as any).sellGeo as number : undefined;
  const buyGeo = isItems && typeof (item as any)?.buyGeo === "number" ? (item as any).buyGeo as number : undefined;
  const whereText = isCombat ? ((item as any)?.where?.trim?.() || (item as any)?.where || "") : "";
  const dropsList: string[] = isCombat && Array.isArray((item as any)?.drops) ? ((item as any).drops as any[]).map(String) : [];

  return (
    <>
      <NavBar />
      <main className="container detail-page">
        <p className="detail-back">
          <Link to={pack?.back ?? "/wiki"} className="btn" style={{ padding: "6px 10px", fontSize: 14 }}>
            BACK TO {(pack?.label ?? "Wiki").toUpperCase()}
          </Link>
        </p>

        {!pack || !item ? (
          <h2>Entry not found</h2>
        ) : (
          <>
            <div className="detail-wrap">
              <header className="detail-header">
                <h2 className="detail-title">{(item as any).title}</h2>
              </header>
              {summary && (
                <p className="detail-sub" style={{ marginTop: 0 }}>{summary}</p>
              )}
              <hr className="section-divider" />

              <section className="detail-grid">
              <aside className="detail-media">
                <div className="media-box" style={{ backgroundImage: imgUrl ? `url(${imgUrl})` : undefined }}>
                  {!imgUrl && <div className="media-fallback">No image</div>}
                </div>
              </aside>

              <article className="detail-body">
                <div>
                  <h3 className="section-title">DETAILS</h3>
                  <div className="info-grid">
                    {showStars && (
                      <div className="info-card">
                        <dl className="dl-clean">
                          <div className="dl-row">
                            <dt className="dl-term">Difficulty</dt>
                            <dd className="dl-def"><Stars n={(item as any).difficulty} /></dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {typeof computedNotches === "number" && slug !== "void-heart" && (
                      <div className="info-card">
                        <dl className="dl-clean">
                          <div className="dl-row">
                            <dt className="dl-term">Notches</dt>
                            <dd className="dl-def"><Notches n={computedNotches} /></dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>

                    {isCombat && whereText && (
                      <div className="info-card">
                        <dl className="dl-clean">
                          <div className="dl-row">
                            <dt className="dl-term">Where</dt>
                            <dd className="dl-def">{whereText}</dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {isCombat && dropsList.length > 0 && (
                      <div className="info-card">
                        <dl className="dl-clean">
                          <div className="dl-row">
                            <dt className="dl-term">Drops</dt>
                            <dd className="dl-def">{dropsList.join(', ')}</dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {hasEffect && effectText && (
                      <div className="info-card">
                        <dl className="dl-clean">
                          <div className="dl-row">
                            <dt className="dl-term">Use</dt>
                            <dd className="dl-def">{effectText}</dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {isItems && typeof sellGeo === 'number' && (
                      <div className="info-card">
                        <dl className="dl-clean">
                          <div className="dl-row">
                            <dt className="dl-term">Sell Price</dt>
                            <dd className="dl-def">{sellGeo} Geo</dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {isItems && typeof buyGeo === 'number' && (
                      <div className="info-card">
                        <dl className="dl-clean">
                          <div className="dl-row">
                            <dt className="dl-term">Buy Price</dt>
                            <dd className="dl-def">{buyGeo} Geo</dd>
                          </div>
                        </dl>
                      </div>
                    )}
                </div>

                {overviewText && (
                  <div>
                    <h3 className="section-title">OVERVIEW</h3>
                    <p className="detail-sub" style={{ marginTop: 0 }}>{overviewText}</p>
                  </div>
                )}

                {obtain && (
                  <div>
                    <h3 className="section-title">ACQUISITION</h3>
                    <p className="detail-sub" style={{ marginTop: 0 }}>{obtain}</p>
                    {slug === "grimmchild" || slug === "carefree-melody" || slug.startsWith("unbreakable-") ? (
                      <p className="detail-sub" style={{ marginTop: 6 }}>
                        Note: Grimm Troupe charms depend on the path chosen — continuing the ritual vs. banishing the troupe.
                      </p>
                    ) : null}
                  </div>
                )}
              </article>
              </section>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}



