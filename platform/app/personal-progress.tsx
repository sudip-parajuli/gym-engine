"use client";
import { useState } from "react";
import type { Journal } from "@/lib/fitness";
import { today, validDate } from "@/lib/domain";
export default function Progress({
  journal,
  save,
  ready,
}: {
  journal: Journal;
  save: (j: Journal) => Promise<boolean>;
  ready: boolean;
}) {
  const [message, setMessage] = useState("");
  const entries = [...(journal.measurements || [])].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  const latest = entries.find((e) => e.weight !== null),
    earliest = [...entries].reverse().find((e) => e.weight !== null);
  return (
    <div className="journal-layout">
      <form
        className="public-panel"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget,
            f = new FormData(form),
            date = String(f.get("date")),
            weight = f.get("weight") ? Number(f.get("weight")) : null,
            waist = f.get("waist") ? Number(f.get("waist")) : null;
          if (
            !validDate(date) ||
            date > today() ||
            (!weight && !waist) ||
            (weight !== null && (weight < 20 || weight > 400)) ||
            (waist !== null && (waist < 20 || waist > 300))
          ) {
            setMessage(
              "Enter a valid past/today date and at least one measurement in the shown range.",
            );
            return;
          }
          if (
            await save({
              ...journal,
              measurements: [
                {
                  id: crypto.randomUUID(),
                  date,
                  weight,
                  waist,
                  note: String(f.get("note") || "").slice(0, 500),
                },
                ...entries,
              ],
            })
          ) {
            setMessage("Progress record saved to your account.");
            form.reset();
          }
        }}
      >
        <h2>Your own baseline</h2>
        <p className="public-small">
          Measurements are optional personal records, not diagnoses or a score
          of your fitness.
        </p>
        <label>
          Date
          <input
            name="date"
            type="date"
            defaultValue={today()}
            max={today()}
            required
          />
        </label>
        <label>
          Weight (kg, optional · 20–400)
          <input name="weight" type="number" min={20} max={400} step="0.1" />
        </label>
        <label>
          Waist (cm, optional · 20–300)
          <input name="waist" type="number" min={20} max={300} step="0.1" />
        </label>
        <label>
          Progress note
          <textarea
            name="note"
            maxLength={500}
            placeholder="Strength, energy, recovery, or another change you noticed"
          />
        </label>
        <button className="fitness-primary" disabled={!ready}>
          Save progress
        </button>
        <p role="status" className="public-small">
          {message}
        </p>
      </form>
      <section className="public-panel">
        <h2>Progress history</h2>
        {latest && earliest && latest.id !== earliest.id && (
          <p className="public-source">
            Recorded weight change:{" "}
            {(latest.weight! - earliest.weight!).toFixed(1)} kg between{" "}
            {earliest.date} and {latest.date}. This describes your entries; it
            is not a health judgment.
          </p>
        )}
        {entries.length ? (
          entries.map((e) => (
            <article className="journal-entry" key={e.id}>
              <div>
                <strong>{e.date}</strong>
                <p>
                  {e.weight !== null ? e.weight + " kg" : ""}
                  {e.waist !== null ? " · Waist " + e.waist + " cm" : ""}
                </p>
                <small>{e.note}</small>
              </div>
            </article>
          ))
        ) : (
          <p className="public-small">No measurements recorded yet.</p>
        )}
      </section>
    </div>
  );
}
