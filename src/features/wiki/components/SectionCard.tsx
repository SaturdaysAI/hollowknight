import { Link } from "react-router-dom";
import type { WikiSection } from "../../../lib/search";

export default function SectionCard({ sec }: { sec: WikiSection }) {
  return (
    <section
      style={{
        background: "var(--btn-bg-2)",
        border: "1px solid var(--btn-border)",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <h3 style={{ margin: 0 }}>{sec.title}</h3>
        <span style={{ fontSize: 12, opacity: 0.8 }}>{sec.items.length} items</span>
      </div>

      <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
        {sec.items.slice(0, 5).map((it) => (
          <li key={it.slug} style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
            <Link to={`/wiki/${sec.id}/${it.slug}`} className="btn" style={{ padding: "6px 10px", fontSize: 14 }}>
              {it.title}
            </Link>
            {it.summary && <span style={{ color: "var(--text-subtle)" }}>{it.summary}</span>}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 12 }}>
        <Link to={`/wiki/${sec.id}`} className="btn secondary" style={{ padding: "6px 10px", fontSize: 14 }}>
          View all {sec.title}
        </Link>
      </div>
    </section>
  );
}
