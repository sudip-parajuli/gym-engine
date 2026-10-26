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
      registrationAvailable={
        process.env.NODE_ENV !== "production" ||
        !!(process.env.RESEND_API_KEY && process.env.MAIL_FROM)
      }
    />
  );
}
