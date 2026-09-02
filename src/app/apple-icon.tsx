import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const bands = ["#2de3d6", "#7c4dff", "#b83fe0", "#b9a6f5"];

export default function AppleIcon() {
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
