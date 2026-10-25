import { EXERCISES } from "./fitness";
export type Movement = {
  slug: string;
  name: string;
  muscles: string[];
  equipment: string;
  position: string;
  cue: string;
  adaptation: string;
  source: string;
};
const muscles: Record<string, string[]> = {
  squat: ["Quads", "Glutes"],
  push: ["Chest", "Triceps"],
  bridge: ["Glutes", "Hamstrings"],
  bird: ["Core", "Back"],
  walk: ["Cardio"],
  row: ["Back", "Biceps"],
  press: ["Chest", "Triceps"],
  leg: ["Quads", "Glutes"],
};
export const MOVEMENTS: Movement[] = [
  ...EXERCISES.map((x) => ({
    slug: x.id,
    name: x.name,
    muscles: muscles[x.id],
    equipment: x.equipment,
    position: ["bridge", "bird"].includes(x.id)
      ? "Floor"
      : ["row", "press", "leg"].includes(x.id)
        ? "Seated"
        : "Standing",
    cue: x.cue,
    adaptation: x.easier,
    source:
      "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  })),
  ...[
    [
      "calf-raise",
      "Supported calf raise",
      "Calves",
      "Home",
      "Standing",
      "With stable support, lift and lower your heels with control.",
      "Use a small range and keep your support.",
    ],
    [
      "side-leg",
      "Supported side leg lift",
      "Glutes",
      "Home",
      "Standing",
      "Use stable support and move one leg gently to the side.",
      "Keep the range comfortable and avoid leaning.",
    ],
    [
      "curl",
      "Biceps curl",
      "Biceps",
      "Home",
      "Seated",
      "Bend and straighten your elbow with a light, manageable resistance.",
      "Try seated with no added load first.",
    ],
    [
      "seated-march",
      "Seated marching",
      "Quads,Core",
      "Home",
      "Seated",
      "Sit on a stable chair and alternate small, controlled leg lifts if comfortable.",
      "Reduce the lift or ask a professional for an alternative.",
    ],
    [
      "ankle",
      "Seated ankle movement",
      "Calves",
      "Home",
      "Seated",
      "From a supported seat, gently point and flex your foot through a comfortable range.",
      "Use one foot at a time with appropriate support.",
    ],
    [
      "seated-twist",
      "Seated upper-body turn",
      "Core,Back",
      "Home",
      "Seated",
      "Turn your upper body gently while seated, staying in a comfortable range.",
      "Reduce rotation; skip this movement if restricted by your care plan.",
    ],
    [
      "neck-turn",
      "Gentle seated neck turn",
      "Neck",
      "Home",
      "Seated",
      "While seated comfortably, turn your head gently to each side without forcing the range.",
      "Use a smaller range and stop if uncomfortable.",
    ],
    [
      "chest-stretch",
      "Seated chest opening",
      "Chest,Shoulders",
      "Home",
      "Seated",
      "Sit tall and gently open your chest without forcing your shoulders back.",
      "Keep your hands supported if that is more comfortable.",
    ],
  ].map(([slug, name, groups, equipment, position, cue, adaptation]) => ({
    slug,
    name,
    muscles: groups.split(","),
    equipment,
    position,
    cue,
    adaptation,
    source:
      position === "Seated" && slug !== "curl"
        ? "https://www.nhs.uk/live-well/exercise/sitting-exercises/"
        : "https://www.nhs.uk/live-well/exercise/strength-exercises/",
  })),
  ...[
    [
      "shoulder-press",
      "Light shoulder press",
      "Shoulders,Triceps",
      "Gym",
      "Seated",
      "Press a manageable resistance through a comfortable shoulder range.",
      "Ask a trainer to check setup; omit overhead movement if it is restricted.",
    ],
    [
      "lateral-raise",
      "Light lateral raise",
      "Shoulders",
      "Gym",
      "Standing",
      "Move light resistance out to the side with control.",
      "Use no added load and a smaller range.",
    ],
    [
      "triceps",
      "Cable triceps pressdown",
      "Triceps",
      "Gym",
      "Standing",
      "Extend your elbows against manageable cable resistance with your upper arms steady.",
      "Lower the load and get help with machine setup.",
    ],
    [
      "hip-hinge",
      "Hip-hinge practice",
      "Hamstrings,Glutes,Back",
      "Home",
      "Standing",
      "Practice moving your hips back while keeping a comfortable, controlled trunk position.",
      "Use no added load and ask for coaching if unfamiliar.",
    ],
    [
      "step-up",
      "Low supported step-up",
      "Quads,Glutes",
      "Home",
      "Standing",
      "Step onto a low, stable platform using appropriate support.",
      "Use a lower platform or a supported alternative.",
    ],
    [
      "dead-bug",
      "Dead bug variation",
      "Core",
      "Home",
      "Floor",
      "From your back, move one limb at a time while keeping your trunk controlled.",
      "Use a small range and a comfortable supported position.",
    ],
    [
      "cycle",
      "Stationary cycling",
      "Cardio,Quads",
      "Gym",
      "Seated",
      "Use a comfortable seat position and an easy pace to begin.",
      "Choose appropriate access and support; get help adjusting the machine.",
    ],
    [
      "rower",
      "Easy rowing machine practice",
      "Cardio,Back",
      "Gym",
      "Seated",
      "Learn the machine sequence with a coach before increasing pace or resistance.",
      "Use short, easy practice intervals only if suitable.",
    ],
  ].map(([slug, name, groups, equipment, position, cue, adaptation]) => ({
    slug,
    name,
    muscles: groups.split(","),
    equipment,
    position,
    cue,
    adaptation,
    source:
      "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  })),
];
export const MUSCLE_GROUPS = [
  ...new Set(MOVEMENTS.flatMap((m) => m.muscles)),
].sort();
export function filterMovements(
  query: string,
  group: string,
  equipment: string,
  position: string,
) {
  return MOVEMENTS.filter(
    (m) =>
      (group === "All" || m.muscles.includes(group)) &&
      (equipment === "All" || m.equipment === equipment) &&
      (position === "All" || m.position === position) &&
      `${m.name} ${m.muscles.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
}
