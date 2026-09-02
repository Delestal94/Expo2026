import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const bands = ["#2de3d6", "#7c4dff", "#b83fe0", "#b9a6f5"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0b0a12",
          color: "#f5f1e8",
        }}
      >
        <div style={{ display: "flex", height: 16 }}>
          {bands.map((color) => (
            <div key={color} style={{ flex: 1, display: "flex", background: color }} />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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
