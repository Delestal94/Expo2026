import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const bands = ["#d98b3f", "#b4432e", "#7c5a9e", "#2e8f86", "#c24d6b"];

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0b0a12",
        }}
      >
        {bands.map((color) => (
          <div key={color} style={{ flex: 1, display: "flex", background: color }} />
        ))}
      </div>
    ),
    { ...size },
  );
}
