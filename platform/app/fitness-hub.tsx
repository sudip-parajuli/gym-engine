"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Dumbbell,
  Heart,
  Leaf,
  Search,
  ShieldCheck,
  Utensils,
  Wallet,
} from "lucide-react";
import { EXERCISES, FOODS } from "@/lib/fitness";
import ExerciseExplorer from "./exercise-explorer";
import PersonalPlanner from "./personal-planner";
import PersonalJournal from "./personal-journal";
import "./fitness.css";
const links = [
  ["discover", "Discover", "/"],
  ["planner", "Plan your next step", "/planner"],
  ["foods", "Food library", "/foods"],
  ["exercises", "Exercises", "/exercises"],
  ["diets", "Diet styles", "/diets"],
  ["research", "Research", "/research"],
  ["assistant", "Ask", "/assistant"],
  ["my-space", "My space", "/my-space"],
];
export const SOURCES = {
  diet: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
  activity:
    "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  energy: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
};
export default function FitnessHub({ section }: { section: string }) {
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All");
  const foods = FOODS.filter(
    (f) =>
      (filter === "All" || f.group === filter) &&
      `${f.name} ${f.note}`.toLowerCase().includes(query.toLowerCase()),
  );
  const exercises = EXERCISES.filter(
    (x) =>
      (filter === "All" || x.pattern === filter) &&
      `${x.name} ${x.equipment}`.toLowerCase().includes(query.toLowerCase()),
  );
  const headings: Record<string, string[]> = {
    planner: [
      "YOUR LIFE. YOUR NEXT STEP.",
      "A plan you can make your own.",
      "Explore meal and movement drafts without an account. Sign in only when you want to save your plan.",
    ],
    foods: [
      "KNOW WHAT’S ON YOUR PLATE",
      "Good food can feel familiar.",
      "Explore everyday ingredients and ways to combine them. No account needed.",
    ],
    exercises: [
      "LEARN THE MOVEMENT. FIND YOUR PACE.",
      "There’s more than one way to move.",
      "Explore starting movements for home and gym sessions. Choose a comfortable range and learn the setup before adding difficulty.",
    ],
    learn: [
      "A LITTLE KNOWLEDGE GOES A LONG WAY",
      "Get to know your engine.",
      "Understand food, movement, and how a gym works—before choosing your next step.",
    ],
    "my-space": [
      "YOUR OWN LITTLE CORNER",
      "Keep track. Keep going.",
      "Sign in to keep meals, workouts, plans, and progress in your own account. You do not need to join a gym.",
    ],
  };
  return (
    <div className="fitness-site">
      <header className="fitness-header">
        <Brand />
        <nav aria-label="Main navigation">
          {links.map(([key, label, path]) => (
            <Link
              key={key}
              href={path}
              className={section === key ? "current" : ""}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/account" className="gym-link">
          Sign in
        </Link>
        <Link href="/manage" className="gym-link">
          For gyms
          <ArrowUpRight size={14} />
        </Link>
      </header>
      <main className="fitness-main">
        {section === "discover" ? (
          <>
            <section className="fitness-hero">
              <div className="hero-copy">
                <span className="open-badge">
                  <span />
                  OPEN TO EVERY BODY
                </span>
                <h1>
                  Find your rhythm.
                  <br />
                  <em>Build your strong.</em>
                </h1>
                <p>
                  Your everyday space to understand food, discover movement, and
                  make a plan that fits your life. Gym membership optional.
                </p>
                <div className="hero-actions">
                  <Link className="fitness-primary" href="/planner">
                    Build my plan
                    <ArrowUpRight size={18} />
                  </Link>
                  <Link className="fitness-secondary" href="/learn">
                    Start with the basics
                    <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="hero-caption">
                  <Check size={14} />
                  Free to explore <span>·</span> No sign-in needed{" "}
                  <span>·</span> Made with Nepal in mind
                </div>
              </div>
              <div
                className="hero-board"
                aria-label="Sample weekly planning board"
              >
                <div className="board-top">
                  <span>YOUR NEXT CHAPTER</span>
                  <span className="board-dot" />
                </div>
                <div className="board-title">
                  A little stronger.
                  <br />A little more you.
                </div>
                <div className="week-strip">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span
                      className={[0, 2, 4].includes(i) ? "day-filled" : ""}
                      key={i}
                    >
                      {[0, 2, 4].includes(i) ? <Check size={13} /> : d}
                    </span>
                  ))}
                </div>
                <div className="board-card">
                  <span className="board-icon">
                    <Utensils size={20} />
                  </span>
                  <div>
                    <strong>Food that feels familiar</strong>
                    <small>Dal, rice, vegetables. Start where you are.</small>
                  </div>
                  <Leaf size={17} />
                </div>
                <div className="board-card">
                  <span className="board-icon movement">
                    <Activity size={21} />
                  </span>
                  <div>
                    <strong>Movement you can come back to</strong>
                    <small>At home, at the gym, or outside.</small>
                  </div>
                  <ArrowUpRight size={17} />
                </div>
                <div className="board-bottom">
                  <span>PROGRESS OVER PERFECTION</span>
                  <span>01 / ∞</span>
                </div>
                <div className="floating-sticker">
                  <Heart size={16} />
                  Your pace. Your path.
                </div>
              </div>
            </section>
            <section className="fitness-intro">
              <p className="fitness-kicker">ONE ENGINE. DIFFERENT JOURNEYS.</p>
              <h2>For the first rep. And every one after.</h2>
              <p>You don’t need to own a gym to belong here.</p>
            </section>
            <section className="journey-grid">
              {[
                {
                  icon: Utensils,
                  tag: "EAT WITH INTENTION",
                  title: "Make room for better food.",
                  body: "Explore familiar ingredients and put together meal ideas around your preferences.",
                  path: "/foods",
                  cta: "Explore food",
                },
                {
                  icon: Dumbbell,
                  tag: "MOVE YOUR WAY",
                  title: "Find your kind of movement.",
                  body: "Learn basic exercises and build a routine around your goal, experience, and equipment.",
                  path: "/exercises",
                  cta: "Find an exercise",
                },
                {
                  icon: BookOpen,
                  tag: "NOTICE THE SMALL WINS",
                  title: "Keep a little record of you.",
                  body: "Log meals and workouts, review your day, and save the plans you want to return to.",
                  path: "/my-space",
                  cta: "Open my space",
                },
              ].map(({ icon: Icon, ...c }, i) => (
                <Link
                  className={"journey-card journey-" + i}
                  href={c.path}
                  key={c.path}
                >
                  <span className="journey-icon">
                    <Icon size={23} />
                  </span>
                  <small>{c.tag}</small>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                  <span className="journey-cta">
                    {c.cta}
                    <ArrowUpRight size={15} />
                  </span>
                </Link>
              ))}
            </section>
            <section className="public-gym-callout">
              <div>
                <span className="fitness-kicker">RUN A GYM?</span>
                <h2>Your community deserves a good engine, too.</h2>
                <p>
                  Keep members, payments, and attendance moving in your staff
                  workspace.
                </p>
              </div>
              <Link className="fitness-secondary" href="/manage">
                Open gym management
                <ArrowRight size={16} />
              </Link>
            </section>
          </>
        ) : (
          <section className="public-page-heading">
            <p className="fitness-kicker">{headings[section]?.[0]}</p>
            <h1>{headings[section]?.[1]}</h1>
            <p>{headings[section]?.[2]}</p>
          </section>
        )}
        {section === "planner" && <PersonalPlanner />}
        {section === "my-space" && <PersonalJournal />}
        {section === "exercises" && <ExerciseExplorer />}
        {section === "foods" && (
          <>
            <div className="library-toolbar">
              <label className="library-search">
                <Search size={17} />
                <input
                  aria-label="Search library"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find something for you…"
                />
              </label>
              <div className="library-filters">
                {(section === "foods"
                  ? [
                      "All",
                      "Grains",
                      "Protein foods",
                      "Vegetables",
                      "Fruit",
                      "Dairy",
                      "Nuts & seeds",
                    ]
                  : ["All", "Lower body", "Upper body", "Core", "Cardio"]
                ).map((c) => (
                  <button
                    className={c === filter ? "chosen" : ""}
                    onClick={() => setFilter(c)}
                    key={c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            {section === "foods" ? (
              <div className="food-grid">
                {foods.map((f, i) => (
                  <article className="food-card" key={f.id}>
                    <div className={"food-art food-art-" + (i % 4)}>
                      <Leaf size={38} />
                      <span>{f.name.split(" / ")[0]}</span>
                    </div>
                    <div className="food-card-body">
                      <span className="fitness-kicker">{f.group}</span>
                      <h2>{f.name}</h2>
                      <p>{f.note}</p>
                      <div className="food-tags">
                        <span>{f.vegan ? "Plant-based" : "Animal-based"}</span>
                        {f.allergens.length > 0 && (
                          <span>
                            Listed allergens: {f.allergens.join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="exercise-grid">
                {exercises.map((x, i) => (
                  <article className="exercise-card" key={x.id}>
                    <div className="exercise-number">
                      0{i + 1}
                      <Dumbbell size={24} />
                    </div>
                    <span className="fitness-kicker">
                      {x.pattern} · {x.equipment}
                    </span>
                    <h2>{x.name}</h2>
                    <p>{x.cue}</p>
                    <div className="exercise-adapt">
                      <strong>Make it more approachable</strong>
                      <p>{x.easier}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
            {!(section === "foods" ? foods.length : exercises.length) && (
              <PublicEmpty
                title="No results match."
                text="Try another search or category."
              />
            )}
            <div className="public-source">
              {section === "foods"
                ? "Food entries describe ingredients, not verified nutrient servings. Use a label or trusted food-composition source when logging nutrients."
                : "Text cues are a starting reference, not a form assessment. A trainer can help you learn an unfamiliar exercise."}{" "}
              <a
                href={section === "foods" ? SOURCES.diet : SOURCES.activity}
                target="_blank"
                rel="noreferrer"
              >
                Read WHO guidance ↗
              </a>
            </div>
          </>
        )}
        {section === "learn" && (
          <div className="learn-grid">
            {[
              {
                icon: Utensils,
                tag: "NUTRITION BASICS",
                title: "Build variety into everyday meals.",
                body: "A healthy eating pattern balances adequacy, variety, and moderation. Whole grains, pulses, fruit, and vegetables can all play a part. Local availability and personal needs matter.",
                href: SOURCES.diet,
                cta: "Source: WHO healthy diet",
              },
              {
                icon: Activity,
                tag: "MOVEMENT BASICS",
                title: "Your activity counts outside the gym.",
                body: "Walking, cycling, recreation, and everyday movement count too. Start with an amount you can manage and build gradually; some activity is better than none.",
                href: SOURCES.activity,
                cta: "Source: WHO physical activity",
              },
              {
                icon: BookOpen,
                tag: "UNDERSTAND YOUR LOG",
                title: "A record is a tool, not a score.",
                body: "Write down what you ate or completed. Portions and exercise loads need units. Blank nutrition fields mean unknown, not zero; compare similar records over time.",
                href: "/my-space",
                cta: "Try your personal journal",
              },
              {
                icon: Wallet,
                tag: "GYM MANAGEMENT, EXPLAINED",
                title: "Your membership and your payment are different.",
                body: "A membership defines your access dates and plan. An invoice records what is owed, a payment records money received, and attendance records visits. Gym Engine keeps these records separate.",
                href: "/manage",
                cta: "Explore the staff workspace",
              },
              {
                icon: ShieldCheck,
                tag: "YOUR PERSONAL SPACE",
                title: "You don’t need a gym to get started.",
                body: "Plan and track independently. Your journal is saved to your personal account after sign-in. It is separate from gym staff records. Export a copy when you need one.",
                href: "/my-space",
                cta: "Open My space",
              },
              {
                icon: Leaf,
                tag: "BODY & ENERGY",
                title: "An equation is an estimate.",
                body: "Resting energy is the energy your body uses at rest. Full daily needs also depend on movement and other factors. A body-size equation cannot measure your metabolism or prescribe an individual diet.",
                href: SOURCES.energy,
                cta: "Source: Mifflin et al., 1990",
              },
            ].map(({ icon: Icon, ...a }) => (
              <article className="learn-card" key={a.tag}>
                <span className="journey-icon">
                  <Icon size={24} />
                </span>
                <span className="fitness-kicker">{a.tag}</span>
                <h2>{a.title}</h2>
                <p>{a.body}</p>
                {a.href.startsWith("/") ? (
                  <Link href={a.href}>
                    {a.cta}
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <a href={a.href} target="_blank" rel="noreferrer">
                    {a.cta}
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
      <footer className="fitness-footer">
        <Brand />
        <p>
          For people who move.
          <br />
          And the gyms that bring them together.
        </p>
        <div>
          <Link href="/learn">Knowledge for everyone</Link>
          <Link href="/privacy">Privacy and your data</Link>
          <Link href="/manage">
            Gym staff workspace
            <ArrowUpRight size={13} />
          </Link>
        </div>
        <small>Made for the everyday strong.</small>
      </footer>
    </div>
  );
}
function Brand() {
  return (
    <Link className="brand" href="/">
      <span className="brand-symbol">
        <Dumbbell size={20} />
      </span>
      gym<span className="fitness-engine">engine</span>
    </Link>
  );
}
export function PublicEmpty({
  title,
  text,
  href,
  label,
}: {
  title: string;
  text: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="public-empty">
      <span>
        <Leaf size={29} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      {href && (
        <Link className="fitness-secondary" href={href}>
          {label}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
