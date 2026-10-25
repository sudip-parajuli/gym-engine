"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Dumbbell,
  Flame,
  Leaf,
  Plus,
  Sparkles,
  Utensils,
} from "lucide-react";
import {
  DEFAULT_PROFILE,
  FOODS,
  makePlan,
  type Profile,
  type FitnessPlan,
} from "@/lib/fitness";
import { useJournal } from "@/lib/use-journal";
const foodName = (id: string) => FOODS.find((f) => f.id === id)?.name || id;
export default function PersonalPlanner() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE),
    [plan, setPlan] = useState<FitnessPlan | null>(null);
  const { journal, ready, message, setMessage, save, signedIn } = useJournal();
  function generate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setPlan(makePlan(profile));
      setMessage("Your draft is ready. Review and edit it below.");
    } catch (e) {
      setPlan(null);
      setMessage(e instanceof Error ? e.message : "Check your preferences.");
    }
  }
  async function savePlan() {
    if (!plan) return;
    if (
      !plan.name.trim() ||
      plan.meals.some((m) => !m.foods.length) ||
      plan.routine.some((r) => !r.items.length)
    ) {
      setMessage("Name your plan and keep an item in every meal and session.");
      return;
    }
    if (
      await save({
        ...journal,
        plans: [plan, ...journal.plans.filter((p) => p.id !== plan.id)],
      })
    )
      setMessage("Plan saved to your account. Find it in My space.");
  }
  const select = (
    label: string,
    key:
      | "goal"
      | "diet"
      | "equipment"
      | "experience"
      | "dietStyle"
      | "timing"
      | "focus"
      | "mobility"
      | "gender",
    options: string[],
  ) => (
    <label>
      {label}
      <select
        value={profile[key] || options[0]}
        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
      >
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </label>
  );
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
      <div className="planner-layout">
        <form className="public-panel preference-form" onSubmit={generate}>
          <div className="public-panel-title">
            <Sparkles size={20} />
            <h2>Start with you</h2>
          </div>
          {select("Your goal", "goal", [
            "Build consistency",
            "Build strength",
            "Support weight management",
            "Improve endurance",
          ])}
          <div className="form-row">
            {select("Food preference", "diet", [
              "Vegetarian",
              "Vegan",
              "Mixed",
            ])}
            {select("Where you train", "equipment", ["Home", "Gym"])}
          </div>
          <div className="form-row">
            {select("Experience", "experience", [
              "Starting out",
              "Already training",
            ])}
            <label>
              Days available
              <select
                value={profile.days}
                onChange={(e) =>
                  setProfile({ ...profile, days: Number(e.target.value) })
                }
              >
                {[2, 3, 4].map((x) => (
                  <option value={x} key={x}>
                    {x} days a week
                  </option>
                ))}
              </select>
            </label>
          </div>
          <fieldset>
            <legend>Eating pattern and movement needs</legend>
            {select("Diet style", "dietStyle", [
              "Balanced",
              "Plant-forward",
              "Meat-forward",
              "Keto (education only)",
              "Carnivore (education only)",
            ])}
            {select("Meal timing", "timing", [
              "Regular meals",
              "Intermittent fasting (learn first)",
            ])}
            <p className="public-small">
              Food preferences and ingredient exclusions still apply.{" "}
              <Link href="/diets">Compare diet styles and evidence →</Link>
            </p>
            {select("Movement focus", "focus", [
              "Whole body",
              "Upper body",
              "Lower body",
              "Core",
            ])}
            {select("Functional preference", "mobility", [
              "No preference",
              "No floor exercises",
              "Seated options",
            ])}
            {select("Gender (optional)", "gender", [
              "Prefer not to say",
              "Woman",
              "Man",
              "Non-binary",
              "Self-described",
            ])}
            <p className="public-small">
              Exercise choices follow your goals and functional needs. Gender
              alone does not determine a suitable routine.
            </p>
          </fieldset>
          <fieldset>
            <legend>Health context — optional, stays in this draft</legend>
            <div className="ingredient-checks">
              {[
                "Pregnancy or breastfeeding",
                "Diabetes or medicines affecting blood sugar",
                "Kidney or heart condition",
                "Pain, injury, or rehabilitation",
                "Eating disorder history",
              ].map((value) => (
                <label key={value}>
                  <input
                    type="checkbox"
                    checked={(profile.medical || []).includes(value)}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        medical: e.target.checked
                          ? [...(profile.medical || []), value]
                          : (profile.medical || []).filter((x) => x !== value),
                      })
                    }
                  />
                  {value}
                </label>
              ))}
            </div>
            <p className="public-small">
              These contexts need individual professional review before an
              automatic plan. The public evidence library is always available.
              Do not enter diagnoses or medical documents.
            </p>
          </fieldset>
          <fieldset>
            <legend>Exclude listed ingredients</legend>
            <div className="ingredient-checks">
              {[
                "milk",
                "egg",
                "soy",
                "peanut",
                "tree nuts",
                "wheat",
                "gluten",
              ].map((x) => (
                <label key={x}>
                  <input
                    type="checkbox"
                    checked={profile.exclusions.includes(x)}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        exclusions: e.target.checked
                          ? [...profile.exclusions, x]
                          : profile.exclusions.filter((v) => v !== x),
                      })
                    }
                  />
                  {x}
                </label>
              ))}
            </div>
            <p className="public-small">
              Filters use this catalog’s ingredients. Check preparation and
              labels for other allergens and cross-contact.
            </p>
          </fieldset>
          <label className="estimate-check">
            <input
              type="checkbox"
              checked={profile.estimate}
              onChange={(e) =>
                setProfile({ ...profile, estimate: e.target.checked })
              }
            />
            Include an optional resting-energy estimate
          </label>
          {profile.estimate && (
            <div className="body-fields">
              <div className="form-row">
                <label>
                  Age (19–78)
                  <input
                    type="number"
                    min={19}
                    max={78}
                    required
                    value={profile.age}
                    onChange={(e) =>
                      setProfile({ ...profile, age: e.target.value })
                    }
                  />
                </label>
                <label>
                  Equation coefficient
                  <select
                    value={profile.sex}
                    onChange={(e) =>
                      setProfile({ ...profile, sex: e.target.value })
                    }
                  >
                    <option value="female">Female coefficient</option>
                    <option value="male">Male coefficient</option>
                  </select>
                </label>
              </div>
              <div className="form-row">
                <label>
                  Weight (kg)
                  <input
                    type="number"
                    min={35}
                    max={250}
                    step="0.1"
                    required
                    value={profile.weight}
                    onChange={(e) =>
                      setProfile({ ...profile, weight: e.target.value })
                    }
                  />
                </label>
                <label>
                  Height (cm)
                  <input
                    type="number"
                    min={120}
                    max={230}
                    step="0.1"
                    required
                    value={profile.height}
                    onChange={(e) =>
                      setProfile({ ...profile, height: e.target.value })
                    }
                  />
                </label>
              </div>
              <p className="public-small">
                Uses the published equation’s two sex coefficients. This
                estimate may not represent your individual physiology.
              </p>
            </div>
          )}
          <p className="public-small">
            General adult wellness planning. Drafts don’t account for injuries,
            pregnancy, or medical nutrition needs.
          </p>
          <button className="fitness-primary wide">
            Create my draft
            <ArrowRight size={16} />
          </button>
        </form>
        <div className="planner-result">
          {plan ? (
            <>
              <div className="result-heading">
                <span className="open-badge">
                  <Check size={13} />
                  YOUR EDITABLE DRAFT
                </span>
                <h2>Build around your everyday.</h2>
                <p>
                  {plan.profile.goal} · {plan.profile.diet} ·{" "}
                  {plan.profile.equipment.toLowerCase()} training
                </p>
              </div>
              <div className="goal-guidance">
                {plan.profile.goal === "Build strength"
                  ? "Build repeatable full-body sessions and include a protein food with meals."
                  : plan.profile.goal === "Support weight management"
                    ? "Start with regular meals, varied foods, and consistent movement. No calorie deficit is prescribed."
                    : plan.profile.goal === "Improve endurance"
                      ? "Mix comfortable cardio with strength practice and meals you can sustain."
                      : "Choose familiar meals and repeatable sessions. Consistency is the first goal."}
              </div>
              {plan.resting !== null && (
                <div className="energy-note">
                  <Flame size={22} />
                  <div>
                    <strong>
                      {plan.resting.toLocaleString()} kcal/day at rest
                    </strong>
                    <p>
                      An estimate of resting energy use—not your total daily
                      needs or an eating target. No deficit or surplus is
                      prescribed.
                    </p>
                    <a
                      href="https://pubmed.ncbi.nlm.nih.gov/2305711/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Equation and research
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              )}
              <div className="public-panel plan-editor">
                <label>
                  Plan name
                  <input
                    value={plan.name}
                    maxLength={100}
                    onChange={(e) => setPlan({ ...plan, name: e.target.value })}
                  />
                </label>
                <div className="public-panel-title">
                  <Utensils size={19} />
                  <h2>A day of meal ideas</h2>
                </div>
                <p className="public-small">
                  Combine grains, protein foods, and produce. Choose portions
                  for your needs. Custom edits are not checked for excluded
                  ingredients.
                </p>
                {plan.meals.map((meal, i) => (
                  <label className="meal-edit" key={i}>
                    <span>{meal.name}</span>
                    <textarea
                      aria-label={meal.name + " foods"}
                      key={plan.id + "-meal-" + i}
                      defaultValue={meal.foods.map(foodName).join(", ")}
                      maxLength={600}
                      onChange={(e) =>
                        setPlan({
                          ...plan,
                          meals: plan.meals.map((m, j) =>
                            j === i
                              ? {
                                  ...m,
                                  foods: e.target.value
                                    .split(",")
                                    .map((x) => x.trim())
                                    .filter(Boolean),
                                }
                              : m,
                          ),
                        })
                      }
                    />
                  </label>
                ))}
              </div>
              <div className="public-panel plan-editor">
                <div className="public-panel-title">
                  <Dumbbell size={19} />
                  <h2>Your movement week</h2>
                </div>
                {plan.routine.map((r, i) => (
                  <label className="routine-edit" key={i}>
                    <strong>
                      {r.day} <span>{r.focus}</span>
                    </strong>
                    <textarea
                      aria-label={r.day + " routine"}
                      key={plan.id + "-routine-" + i}
                      defaultValue={r.items.join("\n")}
                      maxLength={1500}
                      onChange={(e) =>
                        setPlan({
                          ...plan,
                          routine: plan.routine.map((x, j) =>
                            j === i
                              ? {
                                  ...x,
                                  items: e.target.value
                                    .split("\n")
                                    .filter(Boolean),
                                }
                              : x,
                          ),
                        })
                      }
                    />
                  </label>
                ))}
                <p className="public-small">
                  Rest or choose easy movement on other days. Adjust exercises,
                  sets, and repetitions to your ability.
                </p>
              </div>
              <button
                className="fitness-primary"
                disabled={!ready}
                onClick={savePlan}
              >
                Save plan to my account
                <Plus size={16} />
              </button>
              {!signedIn && (
                <p className="fitness-message">
                  <Link href="/account">
                    Sign in or create an account to save this plan →
                  </Link>
                </p>
              )}
              <p className="public-small save-note">
                Includes your entered planning profile and health preferences.{" "}
                <Link href="/my-space">View saved plans →</Link>
              </p>
            </>
          ) : (
            <div className="planner-empty">
              <div className="large-leaf">
                <Leaf size={50} />
              </div>
              <span className="fitness-kicker">
                START SMALL. MAKE IT YOURS.
              </span>
              <h2>
                A good plan starts
                <br />
                with your real life.
              </h2>
              <p>
                Tell us what you enjoy, where you move, and what you’re working
                toward. You can edit every meal and session.
              </p>
              <div className="planning-principles">
                <span>
                  <Check size={14} />
                  Familiar foods
                </span>
                <span>
                  <Check size={14} />
                  Flexible routines
                </span>
                <span>
                  <Check size={14} />
                  No sign-in wall
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
