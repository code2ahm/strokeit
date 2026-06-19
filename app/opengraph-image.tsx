import { ImageResponse } from "next/og";

export const size = { height: 630, width: 1200 };
export const contentType = "image/png";
export const runtime = "edge";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "oklch(0.72 0.22 250)",
            borderRadius: 16,
            color: "white",
            display: "flex",
            fontSize: 44,
            fontWeight: 700,
            height: 80,
            justifyContent: "center",
            width: 80,
          }}
        >
          S
        </div>
        <p
          style={{
            color: "oklch(0.92 0.02 280)",
            fontFamily: "Inter, sans-serif",
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 0,
            marginTop: 24,
          }}
        >
          Stroke it
        </p>
        <p
          style={{
            color: "oklch(0.55 0.05 280)",
            fontFamily: "Inter, sans-serif",
            fontSize: 24,
            marginTop: 8,
          }}
        >
          Type with Sound
        </p>
      </div>
    ),
    { ...size }
  );
}
