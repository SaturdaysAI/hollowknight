import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import { Link } from "react-router-dom";
import hallownestMap from "../../../assets/mapa.jpg";
import fondoMap from "../../../assets/fondo-map.jpg";
import { useSearchParams } from "react-router-dom";
import areas from "../../../content/wiki/areas.json";

const imgsAreas = import.meta.glob("../../../assets/areas/*", { eager: true, as: "url" }) as Record<string,string>;

const MAP_NATIVE_W = 4096;
const MAP_NATIVE_H = 2304;

type Zone = { id: string; name: string; x: number; y: number };

const ZONES: Zone[] = [
  { id: "howling-cliffs",     name: "Howling Cliffs",      x: 0.2895, y: 0.0877 },
  { id: "dirtmouth",          name: "Dirtmouth",           x: 0.4317, y: 0.1726 },
  { id: "crystal-peak",       name: "Crystal Peak",        x: 0.5744, y: 0.1831 },
  { id: "greenpath",          name: "Greenpath",           x: 0.3091, y: 0.2771 },
  { id: "forgotten-crossroads",name: "Forgotten Crossroads",x: 0.5176, y: 0.3544 },
  { id: "resting-grounds",    name: "Resting Grounds",     x: 0.7373, y: 0.3009 },
  { id: "queens-gardens",     name: "Queen's Gardens",     x: 0.2073, y: 0.5245 },
  { id: "fog-canyon",         name: "Fog Canyon",          x: 0.2723, y: 0.4233 },
  { id: "fungal-wastes",      name: "Fungal Wastes",       x: 0.4387, y: 0.5153 },
  { id: "city-of-tears",      name: "City of Tears",       x: 0.5167, y: 0.4235 },
  { id: "kingdoms-edge",      name: "Kingdom's Edge",      x: 0.9007, y: 0.5185 },
  { id: "deepnest",           name: "Deepnest",            x: 0.2655, y: 0.5851 },
  { id: "royal-waterways",    name: "Royal Waterways",     x: 0.5439, y: 0.6501 },
  { id: "the-hive",           name: "The Hive",            x: 0.8432, y: 0.7612 },
  { id: "ancient-basin",      name: "Ancient Basin",       x: 0.5580, y: 0.7205 },
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const normalizeText = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function MapPage() {
  const [sp] = useSearchParams();

  useEffect(() => {
    const root = document.getElementById("root") || document.documentElement;
    const prevBgVar = root.style.getPropertyValue("--page-bg");
    root.style.setProperty("--page-bg", `url(${fondoMap})`);
    return () => {
      if (prevBgVar) root.style.setProperty("--page-bg", prevBgVar);
      else root.style.removeProperty("--page-bg");
    };
  }, []);

  const [nativeW, setNativeW] = useState(MAP_NATIVE_W);
  const [nativeH, setNativeH] = useState(MAP_NATIVE_H);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const initialized = useRef(false);

  const [zones, setZones] = useState<Zone[]>(ZONES);

  const [query, setQuery] = useState("");
  const filteredZones = useMemo(() => {
    const q = normalizeText(query.trim());
    if (!q) return zones;
    return zones.filter(z => normalizeText(z.name).includes(q));
  }, [query, zones]);

  useEffect(() => {
    const v = viewportRef.current;
    if (!v) return;
    const fit = () => {
      const vw = v.clientWidth; const vh = v.clientHeight; if (!vw || !vh) return;
      const sFit = Math.min(vw / nativeW, vh / nativeH);
      if (!initialized.current) {
        setScale(sFit); setTx((vw - nativeW * sFit) / 2); setTy((vh - nativeH * sFit) / 2); initialized.current = true;
      } else {
        setScale(sFit);
      }
    };
    fit();
    const obs = new ResizeObserver(fit); obs.observe(v); return () => obs.disconnect();
  }, [nativeW, nativeH]);

  const getViewportSize = () => {
    const rect = viewportRef.current!.getBoundingClientRect();
    return { cw: rect.width, ch: rect.height };
  };

  const PAN_MARGIN = 80; // pximo desplazamiento extra permitido
  const clampPan = () => {
    const { cw, ch } = getViewportSize();
    const w = nativeW * scale, h = nativeH * scale;
    const mx = PAN_MARGIN, my = PAN_MARGIN;
    const minX = (w <= cw) ? -mx : (cw - w - mx);
    const maxX = mx;
    const minY = (h <= ch) ? -my : (ch - h - my);
    const maxY = my;
    setTx(prev => clamp(prev, minX, maxX));
    setTy(prev => clamp(prev, minY, maxY));
  };

  const dragging = useRef(false);
  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.target !== e.currentTarget) return;
    dragging.current = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent) => { if (dragging.current){ setTx(v=>v+e.movementX); setTy(v=>v+e.movementY); requestAnimationFrame(clampPan);} };
  const onPointerUp = (e: ReactPointerEvent) => { dragging.current = false; try{(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);}catch{}; clampPan(); };

  const centerOn = (nx:number, ny:number) => { const {cw,ch}=getViewportSize(); const s=scale; setTx(cw/2 - nx*nativeW*s); setTy(ch/2 - ny*nativeH*s); requestAnimationFrame(clampPan); };

  const zoneStyle = (z: Zone): CSSProperties => ({ left: `${z.x * nativeW * scale + tx}px`, top: `${z.y * nativeH * scale + ty}px` });
  // Color helpers for zone labels
  const ZONE_COLORS: Record<string,string> = {
    "howling-cliffs":"#6b5a8e","dirtmouth":"#8d8f92","crystal-peak":"#8a5fb3",
    "greenpath":"#4e7f4a","forgotten-crossroads":"#6aa3c8","resting-grounds":"#b3895a",
    "queens-gardens":"#2f5a2f","fog-canyon":"#996799","fungal-wastes":"#9a8b53",
    "city-of-tears":"#3a5aa8","kingdoms-edge":"#c7b18a","deepnest":"#28303c",
    "royal-waterways":"#38a5b4","the-hive":"#d7c35a","ancient-basin":"#7a6a5f"
  };
  const hexToRgba = (hex: string, a: number) => {
    const h = hex.replace('#','');
    const bigint = parseInt(h,16);
    const r = (bigint>>16)&255, g=(bigint>>8)&255, b=bigint&255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };
  const zoneColorStyle = (id: string): CSSProperties => {
    const hex = ZONE_COLORS[id];
    if (!hex) return {};
    return { background: hexToRgba(hex,.22), borderColor: hexToRgba(hex,.55) } as CSSProperties;
  };
  // Frame color for image in detail panel (uses zone color)
  const zoneMediaFrameStyle = (id: string | null): CSSProperties => {
    if (!id) return {};
    const hex = ZONE_COLORS[id];
    if (!hex) return {};
    return { borderColor: hexToRgba(hex,.55) } as CSSProperties;
  };

  const onSearchKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => { if(e.key!=="Enter")return; const first=filteredZones[0]; if(first){ centerOn(first.x, first.y); setOpen(first.id);} };

  // Detail panel
  type Area = { slug:string; title:string; summary?:string; lore?:string };
  const [open, setOpen] = useState<string|null>(null);
  const getArea = (id:string): Area | null => (areas as Area[]).find(a=>a.slug===id || normalizeText(a.title)===normalizeText(id)) ?? null;
  const getAreaImg = (slug:string) => { const e = Object.entries(imgsAreas).find(([p]) => p.endsWith(`/${slug}.webp`)||p.endsWith(`/${slug}.jpg`)||p.endsWith(`/${slug}.png`)||p.endsWith(`/${slug}.svg`)); return e?.[1] ?? Object.entries(imgsAreas).find(([p])=>p.endsWith('/placeholder.svg'))?.[1] ?? ''; };

  // (Edición de etiquetas eliminada)

  useEffect(()=>{ const c=sp.get('center'); if(!c || !initialized.current) return; const slug=String(c); const z=zones.find(zz=>zz.id===slug); if(z){ requestAnimationFrame(()=>{ centerOn(z.x,z.y); setOpen(z.id); }); } },[sp, initialized.current, scale, nativeW, nativeH]);

  return (
    <>
      <NavBar />
      <main className="container page-wiki">
        <h1 className="wiki-group-title">WORLD MAP</h1>
        <p className="wiki-group-sub">Drag to move. Each label summarizes the area's aura - items, bosses, and other points of interest. Click a label to center the map and open details.</p>

        <div className="map-toolbar">
          <div className="map-search">
            <input value={query} onChange={(e)=>setQuery(e.target.value)} onKeyDown={onSearchKeyDown} placeholder="Busca región…" aria-label="Buscar región" />
          </div>
          <div className="map-zoom">
            <Link to="/wiki" className="btn" style={{ padding: "6px 10px", fontSize: 14 }}>BACK TO WIKI</Link>
          </div>
        </div>

        <div className="map-viewport map-viewport--black" ref={viewportRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
          <img src={hallownestMap} alt="Hallownest map" className="map-image" style={{ width: nativeW * scale, height: nativeH * scale, transform: `translate(${tx}px, ${ty}px)` }} onLoad={(e)=>{ const img=e.currentTarget; if(img.naturalWidth&&img.naturalHeight){ setNativeW(img.naturalWidth); setNativeH(img.naturalHeight); initialized.current=false; } }} draggable={false} />

          {filteredZones.map((z) => (
            <button
              key={z.id}
              className="map-label-only"
              style={{ ...zoneStyle(z), ...zoneColorStyle(z.id) }}
              onClick={() => {
                centerOn(z.x, z.y);
                setOpen(z.id);
              }}
            >
              {z.name}
            </button>
          ))}

          {open && (()=>{ const a=getArea(open!); if(!a) return null; const img=getAreaImg(open!); return (
            <div className="map-detail">
              <div className="detail-media" style={zoneMediaFrameStyle(open)}><div className="media-box" style={{ backgroundImage: img?`url(${img})`:undefined }} /></div>
              <div className="detail-body">
                <div className="detail-header">
                  <button className="btn close-btn" onClick={()=>setOpen(null)}>CLOSE</button>
                </div>
                {a.summary && (<><h4 className="section-title">Overview</h4><p className="detail-sub" style={{marginTop:0}}>{a.summary}</p></>)}
                {a.lore && (<><h4 className="section-title">Lore</h4><p className="detail-sub" style={{marginTop:0}}>{a.lore}</p></>)}
              </div>
            </div>
          ); })()}
        </div>
      </main>
      <Footer />
    </>
  );
}





