import { notFound } from "next/navigation";
import FitnessHub from "../fitness-hub";
const meta: Record<string, [string, string]> = {
  planner: [
    "Free diet and workout planner",
    "Create an editable meal and movement draft by preferences, goals, equipment and access needs. No account needed for one-time planning.",
  ],
  foods: [
    "Food library and everyday ingredients",
    "Explore familiar ingredients, food groups, uses and listed allergens.",
  ],
  exercises: [
    "Exercise library by muscle group and movement setup",
    "Find chest, back, leg, core, shoulder, arm and seated movement references for all genders.",
  ],
  learn: [
    "Fitness and gym knowledge",
    "Understand nutrition, movement, energy estimates, personal tracking and gym operations.",
  ],
  "my-space": [
    "Your fitness records and progress",
    "Sign in to save intake, workouts, plans, and physical progress in your personal account.",
  ],
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params,
    m = meta[section];
  return m
    ? {
        title: m[0],
        description: m[1],
        alternates: { canonical: "/" + section },
        ...(section === "my-space"
          ? { robots: { index: false, follow: false } }
          : {}),
      }
    : {};
}
export default async function PublicSection({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!["planner", "foods", "exercises", "learn", "my-space"].includes(section))
    notFound();
  return <FitnessHub section={section} />;
}
