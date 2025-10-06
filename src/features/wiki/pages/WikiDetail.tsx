import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import { Link, useParams } from "react-router-dom";

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

/** Stars (1–5) */
function Stars({ n = 0 }: { n?: number }) {
  const safe = Math.max(0, Math.min(5, Number.isFinite(n as number) ? (n as number) : 0));
  return (
    <span className="gallery-stars" aria-label={`${safe} out of 5`} title={`${safe} / 5`}>
      {"★".repeat(safe)}
      {"☆".repeat(5 - safe)}
    </span>
  );
}

/** Hunter’s Journal (fallback en inglés para bosses) */
const HUNTER_DESC: Record<string, string> = {
  "broken-vessel": "A Hollow Knight husk animated by parasitic infection. Fights with a crazed, broken echo of nail techniques.",
  "brooding-mawlek": "A territorial beast that spits burning acid. Leaps to crush intruders and protects its nest.",
  "brothers-oro-mato": "Two masters of the nail. Swift and relentless, their coordination leaves few openings.",
  "the-collector": "A tall, skittering figure obsessed with gathering living creatures into jars.",
  "crystal-guardian": "A miner twisted by the crystals' power. Fires searing beams of focused light.",
  "dung-defender": "A proud knight who revels in combat and dung alike. Bounces through filth with jovial ferocity.",
  "false-knight": "A weak creature piloting a stolen, armoured shell. The rage inside rattles its false strength.",
  "flukemarm": "A swollen matriarch of the waterways. Births flukes endlessly to swarm intruders.",
  "god-tamer": "A veteran fighter who battles alongside a loyal beast. Their bond makes them formidable.",
  "great-nailsage-sly": "A humble merchant no more—revealed as a master of the nail with peerless skill.",
  "grimm": "Troupe Master of a travelling theatre. Dances with flame and ritualistic grace.",
  "gruz-mother": "A swollen gruz filled with hatchlings. Crashes about blindly to protect its brood.",
  "hive-knight": "The Hive’s vigilant champion. A righteous defender who wields honeyed lances.",
  "hornet-protector": "Guardian of Hallownest’s crossroads. Agile and precise, strikes with needle and thread.",
  "hornet-sentinel": "A fiercer duel within the heights. Threads bind and strikes come swift as thought.",
  "mantis-lords": "Three sovereigns of the Mantis Tribe. Honourable duelists who test the worthy.",
  "massive-moss-charger": "A huge beast of moss and patience. Charges wildly when disturbed.",
  "nosk": "A shapeshifting predator that lures prey by wearing familiar faces.",
  "paintmaster-sheo": "An artist whose strokes are blades. Turns colour and motion into deadly form.",
  "soul-master": "Head of the Soul Sanctum. Pursued immortality through stolen Soul and cruel study.",
  "soul-warrior": "A duelist forged by Soul Sanctum’s experiments. Leaps and strikes with conjured blades.",
  "traitor-lord": "Cast out for defying tradition. Strikes with overwhelming ferocity.",
  "uumuu": "A jellylike being protected by a storm of electricity. Vulnerable when the storm is broken.",
  "watcher-knights": "Ancient guardians who rise in numbers. Their relentless rhythm overwhelms intruders.",
  "white-defender": "A knight of Hallownest reliving bygone glory beneath the city.",
  "radiance": "A being of light from the moths’ dreams. Seeks to reclaim devotion through blinding purity.",
  "lost-kin": "A broken vessel freed from chains. Swift and sorrowful, cloaked in infection.",
  "hollow-knight": "A vessel forged to contain the Radiance. Fights with tragic violence and restraint."
};

export default function WikiDetail() {
  const { group = "", slug = "" } = useParams();
  const pack = MAP[group as keyof typeof MAP];
  const item = pack?.data.find((i) => i.slug === slug);

  const entries = pack ? Object.entries(pack.imgs) : [];
  const imgUrl =
    entries.find(([p]) =>
      p.endsWith(`/${slug}.jpg`) || p.endsWith(`/${slug}.png`) || p.endsWith(`/${slug}.webp`)
    )?.[1] ?? "";

  // stars sólo si hay difficulty
  const showStars = typeof item?.difficulty === "number" && Number.isFinite(item?.difficulty);

  // summary preferido + fallback para bosses
  const fallbackSummary =
    group === "bosses" && slug ? (HUNTER_DESC[slug] ?? "") : "";
  const summary = (item as any)?.summary?.trim() || fallbackSummary;

  return (
    <>
      <NavBar />

      {/* clase de página para espaciados específicos */}
      <main className="container detail-page">
        {/* bloque back con margen propio (controlado via CSS .detail-back) */}
        <p className="detail-back">
          <Link to={pack?.back ?? "/wiki"} className="btn" style={{ padding: "6px 10px", fontSize: 14 }}>
            ← Back to {pack?.label ?? "Wiki"}
          </Link>
        </p>

        {!pack || !item ? (
          <h2>Entry not found</h2>
        ) : (
          <>
            <header className="detail-header">
              <h2 className="detail-title">{(item as any).title}</h2>
            </header>

            {summary && <p className="detail-sub">{summary}</p>}
            <hr className="section-divider" />

            <section className="detail-grid">
              {/* MEDIA */}
              <aside className="detail-media">
                <div
                  className="media-box"
                  style={{ backgroundImage: imgUrl ? `url(${imgUrl})` : undefined }}
                >
                  {!imgUrl && <div className="media-fallback">No image</div>}
                </div>
              </aside>

              {/* BODY */}
              <article className="detail-body">
                {/* DETAILS */}
                <div>
                  <h3 className="section-title">DETAILS</h3>

                  <div className="info-grid">
                    {/* Difficulty (si corresponde) */}
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

                    {/* Effect / Effects (charms & items) */}
                    {(((item as any).effect) || (Array.isArray((item as any).effects) && (item as any).effects.length)) && (
                      <div className="info-card">
                        <dl className="dl-clean">
                          <div className="dl-row">
                            <dt className="dl-term">Effect</dt>
                            <dd className="dl-def">
                              {Array.isArray((item as any).effects)
                                ? (item as any).effects.join("; ")
                                : (item as any).effect}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {/* Notches (charms) */}
                    {typeof (item as any).notches === "number" && (
                      <div className="info-card">
                        <dl className="dl-clean">
                          <div className="dl-row">
                            <dt className="dl-term">Notches</dt>
                            <dd className="dl-def">{(item as any).notches}</dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {/* Where / Location */}
                    {(item as any).where && (
                      <div className="info-card">
                        <dl className="dl-clean">
                          <div className="dl-row">
                            <dt className="dl-term">Where</dt>
                            <dd className="dl-def">{(item as any).where}</dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {/* Drops */}
                    {Array.isArray((item as any).drops) && (item as any).drops.length > 0 && (
                      <div className="info-card">
                        <dl className="dl-clean">
                          <div className="dl-row">
                            <dt className="dl-term">Drops</dt>
                            <dd className="dl-def">{(item as any).drops.join(", ")}</dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {/* Health (si la incluyes en bosses.json) */}
                    {typeof (item as any).health === "number" && (
                      <div className="info-card">
                        <dl className="dl-clean">
                          <div className="dl-row">
                            <dt className="dl-term">Health</dt>
                            <dd className="dl-def">{(item as any).health}</dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                </div>

                {/* OVERVIEW */}
<div>
  <h3 className="section-title">OVERVIEW</h3>

  {/* 1) Si hay overview, úsalo (soporta varios párrafos con \n\n) */}
  {((item as any).overview && String((item as any).overview).trim().length > 0) ? (
    String((item as any).overview)
      .split(/\n{2,}/)
      .map((para: string, i: number) => (
        <p key={i} className="detail-sub" style={{ marginTop: i ? 8 : 0 }}>
          {para}
        </p>
      ))
  ) : /* 2) Si no hay overview, muestra el summary (si existe) */ summary ? (
    <p className="detail-sub" style={{ marginTop: 0 }}>{summary}</p>
  ) : null}
</div>

              </article>
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
