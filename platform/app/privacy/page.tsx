import Link from "next/link";
import "../fitness.css";

export const metadata = {
  title: "Privacy and your data",
  description: "How Gym Engine handles account details, saved fitness records and authentication.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <main className="fitness-site">
      <div className="fitness-main">
        <Link className="public-back-link" href="/">← Gym Engine</Link>
        <section className="public-page-heading">
          <p className="fitness-kicker">YOUR INFORMATION</p>
          <h1>Privacy and your data.</h1>
          <p>Last updated 26 October 2026. Gym Engine is operated by Sudip Parajuli. Contact <a href="mailto:s.techwired@gmail.com">s.techwired@gmail.com</a> with privacy questions.</p>
        </section>
        <div className="learn-grid">
          <section className="learn-card"><h2>Browse without an account</h2><p>Public guides, food and exercise information, and one-time plans are available without signing in. Hosting services process technical request information, such as IP addresses and browser details, to deliver and protect the site.</p></section>
          <section className="learn-card"><h2>Accounts and sign-in</h2><p>When you register, we store your name, email, verification status and account identifiers. Password accounts use hashed passwords. Google sign-in shares basic profile information, email and an identity identifier with Gym Engine; we do not request access to Gmail, Drive or contacts. Session cookies keep you signed in.</p></section>
          <section className="learn-card"><h2>Your saved fitness records</h2><p>When you choose to save, we store the plans, meals, workouts, measurements and progress records you enter, associated with your account. Some entries may reveal health information. Enter only information you want stored, and avoid uploading medical documents or unnecessary personal details.</p></section>
          <section className="learn-card"><h2>Services that process data</h2><p>Vercel hosts the application, Neon stores account and journal data, Resend delivers verification and password-reset emails, and Google processes Google sign-in. Each service processes the information needed for its role under its own terms and privacy practices. Data may be processed outside Nepal. Gym Engine does not sell your personal fitness records.</p></section>
          <section className="learn-card"><h2>Research helper and AI</h2><p>The default research helper uses the site's curated educational material. Optional external AI is disabled in the current deployment. Saved journals are not automatically submitted to an AI service. Do not enter private health records into public questions.</p></section>
          <section className="learn-card"><h2>Retention and your choices</h2><p>Account details and saved records remain while your account is in use. You can edit your journal and sign out to end your session. To request a copy, correction or deletion of your account and stored records, email the contact above from your account address. We may need to verify ownership. Provider security logs and backups may remain under their retention schedules; deletion is not instantaneous across backups.</p></section>
          <section className="learn-card"><h2>Security and changes</h2><p>Access to personal records requires authentication. No internet service can guarantee absolute security. Report suspected exposure to the contact above without sending passwords or access tokens. We update this page when the way we handle information changes.</p></section>
        </div>
        <p className="public-source">Gym Engine provides educational fitness tools. It is not an emergency service or a substitute for individual medical care.</p>
      </div>
    </main>
  );
}
