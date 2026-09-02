import { ImageResponse } from "next/og";
import { BrandMark } from "./brand-mark";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          background: "#0b0a12",
          color: "#f5f1e8",
        }}
      >
        <BrandMark height={140} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700 }}>ExpoJuy 2026</div>
          <div style={{ display: "flex", fontSize: 40, color: "#b3ab9c" }}>
            9 al 12 de octubre, Ciudad Cultural, Jujuy
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
