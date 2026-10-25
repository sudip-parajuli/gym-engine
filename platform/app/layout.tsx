import "./globals.css";
export const metadata = {
  title: "Gym Engine · Your gym, in motion",
  description: "A focused workspace for independent gyms in Nepal.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
