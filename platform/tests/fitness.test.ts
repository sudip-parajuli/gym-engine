import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_PROFILE,
  FOODS,
  compatible,
  makePlan,
  optionalNumber,
  readJournal,
  restingEnergy,
} from "../lib/fitness.ts";
test("generated meals respect vegan and all listed exclusions", () => {
  const profile = {
    ...DEFAULT_PROFILE,
    diet: "Vegan",
    exclusions: [
      "milk",
      "egg",
      "soy",
      "peanut",
      "tree nuts",
      "wheat",
      "gluten",
    ],
  };
  const p = makePlan(profile);
  for (const meal of p.meals) {
    assert.ok(meal.foods.length > 0);
    for (const id of meal.foods) {
      const food = FOODS.find((f) => f.id === id)!;
      assert.ok(food);
      assert.ok(compatible(food, profile));
    }
  }
});
test("resting estimate uses published coefficients and rejects unsupported inputs", () => {
  assert.equal(
    restingEnergy({
      ...DEFAULT_PROFILE,
      estimate: true,
      weight: "70",
      height: "175",
      age: "30",
      sex: "male",
    }),
    1649,
  );
  assert.equal(
    restingEnergy({
      ...DEFAULT_PROFILE,
      estimate: true,
      weight: "70",
      height: "175",
      age: "30",
      sex: "female",
    }),
    1483,
  );
  assert.throws(() =>
    restingEnergy({
      ...DEFAULT_PROFILE,
      estimate: true,
      weight: "70",
      height: "175",
      age: "16",
    }),
  );
  assert.equal(restingEnergy(DEFAULT_PROFILE), null);
});
test("routine adapts to days, experience, equipment, and goal", () => {
  assert.equal(makePlan({ ...DEFAULT_PROFILE, days: 4 }).routine.length, 4);
  const gym = makePlan({
    ...DEFAULT_PROFILE,
    equipment: "Gym",
    experience: "Already training",
  });
  assert.ok(gym.routine[0].items.some((x) => x.includes("Leg press")));
  assert.ok(gym.routine[0].items.some((x) => x.includes("2–3")));
  assert.ok(
    makePlan({ ...DEFAULT_PROFILE, goal: "Improve endurance" }).routine.some(
      (r) => r.focus === "Easy cardio & mobility",
    ),
  );
});
test("blank nutrients remain unknown, invalid values fail", () => {
  assert.equal(optionalNumber("", 1000), null);
  assert.equal(optionalNumber("0", 1000), 0);
  assert.throws(() => optionalNumber("-1", 1000));
  assert.throws(() => optionalNumber("Infinity", 1000));
});
test("corrupt storage is rejected rather than silently reset", () => {
  assert.throws(() => readJournal("{bad"));
  assert.throws(() => readJournal('{"version":2}'));
  assert.equal(readJournal(null).intakes.length, 0);
  const badPlan = makePlan(DEFAULT_PROFILE);
  assert.throws(() =>
    readJournal(
      JSON.stringify({
        version: 1,
        intakes: [],
        workouts: [],
        plans: [{ ...badPlan, meals: [{ name: "Lunch", foods: null }] }],
      }),
    ),
  );
  const good = { version: 1, intakes: [], workouts: [], plans: [badPlan] };
  assert.equal(readJournal(JSON.stringify(good)).plans[0].id, badPlan.id);
});
