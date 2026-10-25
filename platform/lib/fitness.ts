export type Food = {
  id: string;
  name: string;
  group: string;
  note: string;
  allergens: string[];
  animal: boolean;
  vegan: boolean;
};
export const FOODS: Food[] = [
  {
    id: "rice",
    name: "Rice",
    group: "Grains",
    note: "A familiar base for dal, beans, and vegetables. Choose the portion that suits your appetite and meal.",
    allergens: [],
    animal: false,
    vegan: true,
  },
  {
    id: "dal",
    name: "Dal / lentils",
    group: "Protein foods",
    note: "Use lentils in dal, soup, or a salad. Cooking oil and added ingredients change the finished dish.",
    allergens: [],
    animal: false,
    vegan: true,
  },
  {
    id: "chana",
    name: "Chickpeas / chana",
    group: "Protein foods",
    note: "Cook thoroughly and use in tarkari, salads, or a simple roasted snack.",
    allergens: [],
    animal: false,
    vegan: true,
  },
  {
    id: "oats",
    name: "Oats",
    group: "Grains",
    note: "Cook with water or milk. Check the label if you need certified gluten-free oats.",
    allergens: ["gluten"],
    animal: false,
    vegan: true,
  },
  {
    id: "roti",
    name: "Whole-wheat roti",
    group: "Grains",
    note: "Pair with vegetables and a protein food. Ingredients and serving sizes vary.",
    allergens: ["wheat", "gluten"],
    animal: false,
    vegan: true,
  },
  {
    id: "veg",
    name: "Seasonal vegetables",
    group: "Vegetables",
    note: "Rotate leafy greens and other seasonal vegetables. Wash and prepare safely.",
    allergens: [],
    animal: false,
    vegan: true,
  },
  {
    id: "fruit",
    name: "Seasonal fruit",
    group: "Fruit",
    note: "Pick a whole fruit you enjoy, such as a banana, orange, or guava.",
    allergens: [],
    animal: false,
    vegan: true,
  },
  {
    id: "yogurt",
    name: "Plain yogurt / dahi",
    group: "Dairy",
    note: "Use as a snack or side. Check the label and storage instructions.",
    allergens: ["milk"],
    animal: true,
    vegan: false,
  },
  {
    id: "egg",
    name: "Eggs",
    group: "Protein foods",
    note: "Serve cooked through. Add to a meal alongside grains and vegetables.",
    allergens: ["egg"],
    animal: true,
    vegan: false,
  },
  {
    id: "tofu",
    name: "Tofu",
    group: "Protein foods",
    note: "A soy-based option for stir-fries and curries. Check the product ingredients.",
    allergens: ["soy"],
    animal: false,
    vegan: true,
  },
  {
    id: "nuts",
    name: "Peanuts / nuts",
    group: "Nuts & seeds",
    note: "A convenient topping or snack. Peanuts and tree nuts are different allergens; this catalog groups them conservatively.",
    allergens: ["peanut", "tree nuts"],
    animal: false,
    vegan: true,
  },
  {
    id: "chicken",
    name: "Chicken",
    group: "Protein foods",
    note: "Cook thoroughly and prevent contact between raw poultry and ready-to-eat foods.",
    allergens: [],
    animal: true,
    vegan: false,
  },
];
export const EXERCISES = [
  {
    id: "squat",
    name: "Chair squat",
    pattern: "Lower body",
    equipment: "Home",
    cue: "Sit back to a stable chair, keep your feet planted, and stand with control.",
    easier: "Use a higher chair and a smaller range.",
  },
  {
    id: "push",
    name: "Incline push-up",
    pattern: "Upper body",
    equipment: "Home",
    cue: "Use a stable wall or counter. Keep your body in a straight line as you bend and straighten your arms.",
    easier: "Choose a higher surface.",
  },
  {
    id: "bridge",
    name: "Glute bridge",
    pattern: "Lower body",
    equipment: "Home",
    cue: "Lie on your back with knees bent. Lift your hips gently without arching your lower back.",
    easier: "Reduce the lift height.",
  },
  {
    id: "bird",
    name: "Bird dog",
    pattern: "Core",
    equipment: "Home",
    cue: "From hands and knees, reach one arm and the opposite leg while keeping your trunk steady.",
    easier: "Move one limb at a time.",
  },
  {
    id: "walk",
    name: "Brisk walk",
    pattern: "Cardio",
    equipment: "Home",
    cue: "Choose a comfortable route and a pace at which you can still talk. Build time gradually.",
    easier: "Walk slowly for a shorter period.",
  },
  {
    id: "row",
    name: "Seated cable row",
    pattern: "Upper body",
    equipment: "Gym",
    cue: "Choose a manageable load. Pull handles toward your torso without jerking or leaning back.",
    easier: "Reduce the weight and ask a trainer to check setup.",
  },
  {
    id: "press",
    name: "Machine chest press",
    pattern: "Upper body",
    equipment: "Gym",
    cue: "Adjust the seat so handles are around chest height. Press smoothly and return with control.",
    easier: "Use a light load and comfortable range.",
  },
  {
    id: "leg",
    name: "Leg press",
    pattern: "Lower body",
    equipment: "Gym",
    cue: "Set a comfortable depth with your back supported. Move slowly and avoid locking your knees.",
    easier: "Reduce the load and range with trainer guidance.",
  },
];
export type Profile = {
  goal: string;
  diet: string;
  equipment: string;
  days: number;
  experience: string;
  exclusions: string[];
  age: string;
  weight: string;
  height: string;
  sex: string;
  estimate: boolean;
};
export const DEFAULT_PROFILE: Profile = {
  goal: "Build consistency",
  diet: "Vegetarian",
  equipment: "Home",
  days: 3,
  experience: "Starting out",
  exclusions: [],
  age: "",
  weight: "",
  height: "",
  sex: "female",
  estimate: false,
};
export function restingEnergy(profile: Profile): number | null {
  if (!profile.estimate) return null;
  const { age, weight, height } = Object.fromEntries(
    ["age", "weight", "height"].map((k) => [
      k,
      Number(profile[k as keyof Profile]),
    ]),
  ) as Record<string, number>;
  if (
    ![age, weight, height].every(Number.isFinite) ||
    age < 19 ||
    age > 78 ||
    weight < 35 ||
    weight > 250 ||
    height < 120 ||
    height > 230 ||
    !["female", "male"].includes(profile.sex)
  )
    throw new Error(
      "For the optional estimate, enter age 19–78, weight 35–250 kg, and height 120–230 cm.",
    );
  return Math.round(
    10 * weight + 6.25 * height - 5 * age + (profile.sex === "male" ? 5 : -161),
  );
}
export function compatible(food: Food, profile: Profile) {
  return (
    !food.allergens.some((x) => profile.exclusions.includes(x)) &&
    (profile.diet !== "Vegan" || food.vegan) &&
    (profile.diet !== "Vegetarian" || food.id !== "chicken")
  );
}
export type FitnessPlan = {
  id: string;
  name: string;
  created: string;
  profile: Profile;
  resting: number | null;
  meals: { name: string; foods: string[] }[];
  routine: { day: string; focus: string; items: string[] }[];
};
export function makePlan(profile: Profile): FitnessPlan {
  if (
    ![
      "Build consistency",
      "Build strength",
      "Support weight management",
      "Improve endurance",
    ].includes(profile.goal) ||
    !["Vegan", "Vegetarian", "Mixed"].includes(profile.diet) ||
    !["Home", "Gym"].includes(profile.equipment) ||
    !["Starting out", "Already training"].includes(profile.experience) ||
    ![2, 3, 4].includes(profile.days) ||
    profile.exclusions.some(
      (x) =>
        ![
          "milk",
          "egg",
          "soy",
          "peanut",
          "tree nuts",
          "wheat",
          "gluten",
        ].includes(x),
    )
  )
    throw new Error("Choose supported planning preferences.");
  const eligible = (ids: string[]) =>
    ids.filter((id) => {
      const f = FOODS.find((x) => x.id === id);
      return f && compatible(f, profile);
    });
  const protein =
    profile.diet === "Mixed"
      ? "chicken"
      : profile.diet === "Vegan"
        ? "tofu"
        : "egg";
  const breakfast = eligible([
    "oats",
    "fruit",
    profile.diet === "Vegan" ? "nuts" : "yogurt",
  ]);
  if (!breakfast.some((x) => ["oats", "yogurt", "nuts"].includes(x)))
    breakfast.unshift("chana");
  const dinner = eligible(["roti", protein, "veg"]);
  if (!dinner.includes("roti")) dinner.unshift("rice");
  if (!dinner.includes(protein)) dinner.splice(1, 0, "dal");
  const days =
    profile.days === 2
      ? ["Monday", "Thursday"]
      : profile.days === 3
        ? ["Monday", "Wednesday", "Friday"]
        : ["Monday", "Tuesday", "Thursday", "Saturday"];
  const dose =
    profile.experience === "Starting out"
      ? "Start with 1–2 comfortable sets; keep a few repetitions in reserve."
      : "Use 2–3 controlled sets at a manageable effort; adjust to your current ability.";
  const moves =
    profile.equipment === "Home"
      ? ["Chair squat", "Incline push-up", "Glute bridge", "Bird dog"]
      : ["Leg press", "Machine chest press", "Seated cable row", "Bird dog"];
  return {
    id: crypto.randomUUID(),
    name: `${profile.goal} · ${profile.days} days`,
    created: new Date().toISOString(),
    profile: { ...profile, exclusions: [...profile.exclusions] },
    resting: restingEnergy(profile),
    meals: [
      { name: "Breakfast", foods: breakfast },
      { name: "Lunch", foods: ["rice", "dal", "veg"] },
      {
        name: "Snack",
        foods:
          eligible(["fruit", profile.diet === "Vegan" ? "chana" : "yogurt"])
            .length > 1
            ? eligible(["fruit", profile.diet === "Vegan" ? "chana" : "yogurt"])
            : ["fruit", "chana"],
      },
      { name: "Dinner", foods: dinner },
    ],
    routine: days.map((day, i) => ({
      day,
      focus:
        profile.goal === "Improve endurance" && i % 2 === 1
          ? "Easy cardio & mobility"
          : profile.days === 4 && i % 2 === 1
            ? "Easy movement & recovery"
            : "Full-body practice",
      items:
        profile.goal === "Improve endurance" && i % 2 === 1
          ? [
              "A comfortable walk or cycle; begin with a duration you can repeat.",
              "Gentle mobility and a gradual cool-down.",
            ]
          : profile.days === 4 && i % 2 === 1
            ? [
                "Comfortable walking and gentle mobility.",
                "Keep this easier than your strength days.",
              ]
            : [
                ...moves.map((x) => `${x} · choose a comfortable range`),
                dose,
                "Warm up first. Pause if a movement causes pain.",
              ],
    })),
  };
}
export type Intake = {
  id: string;
  date: string;
  name: string;
  meal: string;
  quantity: string;
  kcal: number | null;
  protein: number | null;
};
export type Workout = {
  id: string;
  date: string;
  name: string;
  sets: number | null;
  reps: number | null;
  load: number | null;
  minutes: number | null;
  notes: string;
};
export type Journal = {
  version: 1;
  intakes: Intake[];
  workouts: Workout[];
  plans: FitnessPlan[];
};
export const EMPTY_JOURNAL: Journal = {
  version: 1,
  intakes: [],
  workouts: [],
  plans: [],
};
export function optionalNumber(value: string, max: number): number | null {
  if (!value.trim()) return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > max)
    throw new Error(
      "Enter a valid non-negative value within the allowed range.",
    );
  return n;
}
export function readJournal(raw: string | null): Journal {
  if (!raw) return { ...EMPTY_JOURNAL };
  try {
    const d = JSON.parse(raw) as Journal;
    if (
      d.version !== 1 ||
      !Array.isArray(d.intakes) ||
      !Array.isArray(d.workouts) ||
      !Array.isArray(d.plans) ||
      d.intakes.some(
        (x) =>
          typeof x.id !== "string" ||
          typeof x.name !== "string" ||
          typeof x.meal !== "string" ||
          typeof x.quantity !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(x.date) ||
          (x.kcal !== null && (!Number.isFinite(x.kcal) || x.kcal < 0)) ||
          (x.protein !== null &&
            (!Number.isFinite(x.protein) || x.protein < 0)),
      )
    )
      throw new Error(
        "This device’s journal could not be read. Existing storage has been left unchanged.",
      );
    if (
      d.workouts.some(
        (x) =>
          typeof x.id !== "string" ||
          typeof x.name !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(x.date) ||
          typeof x.notes !== "string" ||
          [x.sets, x.reps, x.load, x.minutes].some(
            (n) => n !== null && (!Number.isFinite(n) || n < 0),
          ),
      ) ||
      d.plans.some(
        (x) =>
          typeof x.id !== "string" ||
          typeof x.name !== "string" ||
          !x.profile ||
          typeof x.profile.goal !== "string" ||
          typeof x.profile.diet !== "string" ||
          !Number.isFinite(Date.parse(x.created)) ||
          !Array.isArray(x.meals) ||
          !Array.isArray(x.routine) ||
          x.meals.some(
            (m) =>
              typeof m.name !== "string" ||
              !Array.isArray(m.foods) ||
              m.foods.some((f) => typeof f !== "string"),
          ) ||
          x.routine.some(
            (r) =>
              typeof r.day !== "string" ||
              typeof r.focus !== "string" ||
              !Array.isArray(r.items) ||
              r.items.some((i) => typeof i !== "string"),
          ),
      )
    )
      throw new Error(
        "This device’s journal could not be read. Existing storage has been left unchanged.",
      );
    return d;
  } catch {
    throw new Error(
      "This device’s journal could not be read. Existing storage has been left unchanged.",
    );
  }
}
