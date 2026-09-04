import { ImageResponse } from "next/og";

/**
 * A share card for the profile page.
 *
 * Without it the page used summary_large_image with the site-wide picture, so
 * a shared link showed the publication's card rather than the person's.
 */
export const alt = "Sergei Ponomarev, PhD, methodologist of technology adoption";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              color: "#f59e0b",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Sergei Ponomarev, PhD
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 76,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
Methodologist of technology adoption
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.35,
            }}
          >
A career on one question: how a technology actually gets adopted
            inside an organisation
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 30, gap: 16 }}>
            <div
              style={{
                display: "flex",
                backgroundColor: "#f59e0b",
                color: "#000000",
                fontSize: 26,
                fontWeight: 800,
                padding: "10px 22px",
                borderRadius: 10,
              }}
            >
              aibusiness.vc
            </div>
            <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,0.5)" }}>
              Standards · Evaluation · AI agents
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
