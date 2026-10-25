"use client";
import { useState } from "react";
import Link from "next/link";
import { filterMovements, MUSCLE_GROUPS } from "@/lib/exercise-catalog";
export default function Explorer() {
  const [query, setQuery] = useState(""),
    [group, setGroup] = useState("All"),
    [equipment, setEquipment] = useState("All"),
    [position, setPosition] = useState("All");
  const matches = filterMovements(query, group, equipment, position);
  return (
    <>
      <p className="public-source">
        For all genders. Filter by muscle group, equipment, and what a movement
        requires. A disability or medical diagnosis does not determine exercise
        suitability on its own.{" "}
        <Link href="/diets/accessible-movement">
          Read accessible movement guidance →
        </Link>
      </p>
      <div className="movement-filters">
        <label>
          Search exercises
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chest, seated, squat…"
          />
        </label>
        <label>
          Body part / muscle group
          <select value={group} onChange={(e) => setGroup(e.target.value)}>
            {["All", ...MUSCLE_GROUPS].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Equipment
          <select
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
          >
            {["All", "Home", "Gym"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Position
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            {["All", "Seated", "Standing", "Floor"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="public-small">
        {matches.length} movements in this starter catalog. It is an expanding
        reference, not an exhaustive exercise database.
      </p>
      <div className="exercise-grid">
        {matches.map((m, i) => (
          <article className="exercise-card" key={m.slug}>
            <div className="exercise-number">
              {String(i + 1).padStart(2, "0")}
            </div>
            <span className="fitness-kicker">
              {m.muscles.join(" · ")} · {m.position}
            </span>
            <h2>{m.name}</h2>
            <p>{m.cue}</p>
            <div className="exercise-adapt">
              <strong>Adapt the setup</strong>
              <p>{m.adaptation}</p>
            </div>
            <Link href={"/movements/" + m.slug}>Movement details →</Link>
          </article>
        ))}
      </div>
      {!matches.length && (
        <p className="fitness-message">
          No movements match those filters. Try fewer restrictions.
        </p>
      )}
    </>
  );
}
