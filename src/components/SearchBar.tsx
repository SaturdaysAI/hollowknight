// src/components/SearchBar.tsx
import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [q, setQ] = React.useState("");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate(`/wiki?search=${encodeURIComponent(term)}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      aria-label="Search wiki"
      className="search-bar"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search bosses, charms, items…"
        autoComplete="off"
      />
      <button className="btn" type="submit">Search</button>
    </form>
  );
}

