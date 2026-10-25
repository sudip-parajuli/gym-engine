import { ImageResponse } from "next/og";
export const runtime = "nodejs";
export const alt = "Gym Engine — food, movement, progress and gym management";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#eff2e8",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 85,
          color: "#365740",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 5 }}>GYM ENGINE</div>
        <div style={{ fontSize: 78, marginTop: 40, fontWeight: 700 }}>
          Find your rhythm.
        </div>
        <div style={{ fontSize: 78, color: "#82976c" }}>Build your strong.</div>
        <div style={{ fontSize: 25, marginTop: 45 }}>
          Fitness plans · Food & exercise guides · Your progress
        </div>
      </div>
    ),
    size,
  );
}
