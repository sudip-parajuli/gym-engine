import Helper from "./helper";
export const metadata = {
  title: "Fitness research helper",
  description:
    "Find cited fitness and diet guides without signing in. Optional AI explanations use selected sources and disclose their limits.",
  alternates: { canonical: "/assistant" },
};
export default function Assistant() {
  return (
    <Helper
      aiAvailable={
        process.env.AI_ENABLED === "true" &&
        !!process.env.OPENAI_API_KEY &&
        !!process.env.OPENAI_MODEL
      }
    />
  );
}
