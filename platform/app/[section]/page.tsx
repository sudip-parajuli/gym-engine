import { notFound } from "next/navigation";
import FitnessHub from "../fitness-hub";
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
