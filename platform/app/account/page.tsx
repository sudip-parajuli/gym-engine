import { configuredProviders } from "@/lib/personal-auth";
import AccountForm from "./form";
export const metadata = {
  title: "Sign in or create your fitness account",
  robots: { index: false, follow: false },
};
export default function Account() {
  return (
    <AccountForm
      providers={configuredProviders()}
      production={process.env.NODE_ENV === "production"}
    />
  );
}
