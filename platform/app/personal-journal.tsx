"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Dumbbell,
  Leaf,
  Plus,
  ShieldCheck,
  Trash2,
  Utensils,
} from "lucide-react";
import { FOODS, optionalNumber } from "@/lib/fitness";
import { useJournal } from "@/lib/use-journal";
import { today, validDate } from "@/lib/domain";
const foodName = (id: string) => FOODS.find((f) => f.id === id)?.name || id;
export default function PersonalJournal() {
  const { journal, ready, message, setMessage, save } = useJournal();
  const [date, setDate] = useState(""),
    [tab, setTab] = useState("Intake");
  useEffect(() => setDate(today()), []);
  const intakes = journal.intakes.filter((x) => x.date === date),
    workouts = journal.workouts.filter((x) => x.date === date),
    known = intakes.filter((x) => x.kcal !== null),
    protein = intakes.filter((x) => x.protein !== null);
  function addLog(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget,
      f = new FormData(form),
      s = (key: string) => String(f.get(key) || "").trim();
    try {
      if (!validDate(s("date")) || s("date") > today())
        throw new Error("Choose today or a past date for a completed log.");
      if (!s("name")) throw new Error("Enter a food or exercise name.");
      const common = {
        id: crypto.randomUUID(),
        date: s("date"),
        name: s("name").slice(0, 100),
      };
      const next =
        tab === "Intake"
          ? {
              ...journal,
              intakes: [
                {
                  ...common,
                  meal: s("meal"),
                  quantity: s("quantity").slice(0, 100),
                  kcal: optionalNumber(s("kcal"), 10000),
                  protein: optionalNumber(s("protein"), 1000),
                },
                ...journal.intakes,
              ],
            }
          : {
              ...journal,
              workouts: [
                {
                  ...common,
                  sets: optionalNumber(s("sets"), 100),
                  reps: optionalNumber(s("reps"), 1000),
                  load: optionalNumber(s("load"), 1000),
                  minutes: optionalNumber(s("minutes"), 1440),
                  notes: s("notes").slice(0, 500),
                },
                ...journal.workouts,
              ],
            };
      if (save(next)) {
        setDate(common.date);
        setMessage("Entry saved on this device.");
        form.reset();
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Check your entry.");
    }
  }
  function exportJournal() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(journal, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "gym-engine-personal-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      {message && (
        <div className="fitness-message" role="status">
          {message}
          <button onClick={() => setMessage("")} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}
      <div className="device-banner">
        <ShieldCheck size={20} />
        <p>
          <strong>Saved on this device only.</strong> Anyone using this browser
          profile may see these records. They won’t sync across devices;
          clearing browser data removes them.
        </p>
        <button
          className="fitness-secondary"
          disabled={!ready}
          onClick={exportJournal}
        >
          <ArrowDownToLine size={15} />
          Export backup
        </button>
      </div>
      <div className="journal-tabs">
        {["Intake", "Exercise", "Saved plans"].map((t) => (
          <button
            className={tab === t ? "selected" : ""}
            key={t}
            onClick={() => setTab(t)}
          >
            {t}
            {t === "Saved plans" && <span>{journal.plans.length}</span>}
          </button>
        ))}
        {tab !== "Saved plans" && (
          <label className="journal-date">
            Day
            <input
              aria-label="Journal day"
              type="date"
              value={date}
              max={today()}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        )}
      </div>
      {tab === "Saved plans" ? (
        <div className="saved-plans">
          {journal.plans.length ? (
            journal.plans.map((p) => (
              <article className="public-panel saved-plan" key={p.id}>
                <div>
                  <span className="fitness-kicker">
                    {p.profile.goal} · {p.profile.diet}
                  </span>
                  <h2>{p.name}</h2>
                  <p>
                    {p.routine.length} sessions · saved{" "}
                    {new Date(p.created).toLocaleDateString()}
                  </p>
                </div>
                <details>
                  <summary>
                    View meals and routine
                    <ChevronRight size={15} />
                  </summary>
                  <div className="saved-plan-details">
                    {p.meals.map((m, i) => (
                      <div key={i}>
                        <strong>{m.name}</strong>
                        <p>{m.foods.map(foodName).join(", ")}</p>
                      </div>
                    ))}
                    {p.routine.map((r, i) => (
                      <div key={"r" + i}>
                        <strong>
                          {r.day} · {r.focus}
                        </strong>
                        <ul>
                          {r.items.map((x, j) => (
                            <li key={j}>{x}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
                <button
                  className="remove-entry"
                  onClick={() => {
                    if (
                      save({
                        ...journal,
                        plans: journal.plans.filter((x) => x.id !== p.id),
                      })
                    )
                      setMessage("Saved plan removed from this device.");
                  }}
                >
                  <Trash2 size={13} />
                  Remove saved copy
                </button>
              </article>
            ))
          ) : (
            <Empty
              title="Make a plan worth coming back to."
              text="Create and save a meal and movement draft, then find it here."
              plan
            />
          )}
        </div>
      ) : (
        <>
          <div className="journal-summary">
            <div>
              <span>
                {tab === "Intake" ? "Meal entries" : "Exercise entries"}
              </span>
              <strong>
                {tab === "Intake" ? intakes.length : workouts.length}
              </strong>
            </div>
            <div>
              <span>
                {tab === "Intake"
                  ? "Logged calories"
                  : "Recorded exercise time"}
              </span>
              <strong>
                {tab === "Intake"
                  ? known.length
                    ? known.reduce((s, x) => s + x.kcal!, 0).toLocaleString() +
                      " kcal"
                    : "Not entered"
                  : workouts.some((x) => x.minutes !== null)
                    ? workouts.reduce((s, x) => s + (x.minutes || 0), 0) +
                      " min"
                    : "Not entered"}
              </strong>
              <small>
                {tab === "Intake"
                  ? `${intakes.length - known.length} entries without calorie data`
                  : "Duration is optional; no calorie burn is estimated"}
              </small>
            </div>
            {tab === "Intake" && (
              <div>
                <span>Logged protein</span>
                <strong>
                  {protein.length
                    ? Math.round(
                        protein.reduce((s, x) => s + x.protein!, 0) * 10,
                      ) /
                        10 +
                      " g"
                    : "Not entered"}
                </strong>
                <small>
                  {intakes.length - protein.length} entries without protein data
                </small>
              </div>
            )}
          </div>
          <div className="journal-layout">
            <form className="public-panel log-form" onSubmit={addLog} key={tab}>
              <div className="public-panel-title">
                {tab === "Intake" ? (
                  <Utensils size={20} />
                ) : (
                  <Dumbbell size={20} />
                )}
                <h2>
                  {tab === "Intake"
                    ? "What’s on your plate?"
                    : "What did you move today?"}
                </h2>
              </div>
              <label>
                Date
                <input
                  name="date"
                  type="date"
                  required
                  defaultValue={date || today()}
                  max={today()}
                />
              </label>
              <label>
                {tab === "Intake" ? "Food or meal" : "Exercise name"}
                <input
                  name="name"
                  required
                  maxLength={100}
                  placeholder={
                    tab === "Intake"
                      ? "e.g. Dal bhat with vegetables"
                      : "e.g. Chair squats"
                  }
                />
              </label>
              {tab === "Intake" ? (
                <>
                  <div className="form-row">
                    <label>
                      Meal
                      <select name="meal">
                        <option>Breakfast</option>
                        <option>Lunch</option>
                        <option>Snack</option>
                        <option>Dinner</option>
                      </select>
                    </label>
                    <label>
                      Quantity / serving
                      <input
                        name="quantity"
                        required
                        maxLength={100}
                        placeholder="e.g. 1 bowl, 150 g"
                      />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      Calories (kcal, optional)
                      <input
                        name="kcal"
                        type="number"
                        min="0"
                        max="10000"
                        step="0.1"
                      />
                    </label>
                    <label>
                      Protein (g, optional)
                      <input
                        name="protein"
                        type="number"
                        min="0"
                        max="1000"
                        step="0.1"
                      />
                    </label>
                  </div>
                  <p className="public-small">
                    Enter nutrients for the portion you ate, from a label or
                    trusted source. Leave blank if unknown.
                  </p>
                </>
              ) : (
                <>
                  <div className="form-row">
                    <label>
                      Sets (optional)
                      <input
                        name="sets"
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                      />
                    </label>
                    <label>
                      Reps per set (optional)
                      <input
                        name="reps"
                        type="number"
                        min="0"
                        max="1000"
                        step="1"
                      />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      Load (kg, optional)
                      <input
                        name="load"
                        type="number"
                        min="0"
                        max="1000"
                        step="0.1"
                      />
                    </label>
                    <label>
                      Duration (minutes, optional)
                      <input
                        name="minutes"
                        type="number"
                        min="0"
                        max="1440"
                        step="1"
                      />
                    </label>
                  </div>
                  <label>
                    Notes (optional)
                    <textarea
                      name="notes"
                      maxLength={500}
                      placeholder="How did it feel?"
                    />
                  </label>
                </>
              )}
              <button className="fitness-primary wide" disabled={!ready}>
                Save {tab === "Intake" ? "intake" : "exercise"}
                <Plus size={15} />
              </button>
            </form>
            <div className="public-panel log-list">
              <div className="public-panel-title">
                <BookOpen size={20} />
                <h2>{date ? "Your record · " + date : "Your record"}</h2>
              </div>
              {tab === "Intake" ? (
                intakes.length ? (
                  intakes.map((x) => (
                    <div className="journal-entry" key={x.id}>
                      <span className="entry-icon">
                        <Utensils size={18} />
                      </span>
                      <div>
                        <strong>{x.name}</strong>
                        <p>
                          {x.meal} · {x.quantity}
                        </p>
                        <small>
                          {x.kcal === null
                            ? "Calories unknown"
                            : x.kcal + " kcal"}{" "}
                          ·{" "}
                          {x.protein === null
                            ? "Protein unknown"
                            : x.protein + " g protein"}
                        </small>
                      </div>
                      <button
                        className="remove-entry"
                        aria-label={"Remove " + x.name}
                        onClick={() =>
                          save({
                            ...journal,
                            intakes: journal.intakes.filter(
                              (i) => i.id !== x.id,
                            ),
                          })
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))
                ) : (
                  <Empty
                    title="Your day is a fresh page."
                    text="Add a meal or snack. You don’t need to know every nutrient to keep a useful record."
                  />
                )
              ) : workouts.length ? (
                workouts.map((x) => (
                  <div className="journal-entry" key={x.id}>
                    <span className="entry-icon">
                      <Dumbbell size={18} />
                    </span>
                    <div>
                      <strong>{x.name}</strong>
                      <p>
                        {x.sets !== null ? x.sets + " sets · " : ""}
                        {x.reps !== null ? x.reps + " reps/set · " : ""}
                        {x.load !== null ? x.load + " kg · " : ""}
                        {x.minutes !== null ? x.minutes + " min" : ""}
                      </p>
                      {x.notes && <small>{x.notes}</small>}
                    </div>
                    <button
                      className="remove-entry"
                      aria-label={"Remove " + x.name}
                      onClick={() =>
                        save({
                          ...journal,
                          workouts: journal.workouts.filter(
                            (i) => i.id !== x.id,
                          ),
                        })
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              ) : (
                <Empty
                  title="Every bit of movement counts."
                  text="Record a walk, gym session, or home exercises. Start with what you did."
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
function Empty({
  title,
  text,
  plan,
}: {
  title: string;
  text: string;
  plan?: boolean;
}) {
  return (
    <div className="public-empty">
      <span>
        <Leaf size={29} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      {plan && (
        <Link className="fitness-secondary" href="/planner">
          Build a plan
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
