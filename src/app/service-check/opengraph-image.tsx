import { ImageResponse } from "next/og";

/**
 * A share card for this page specifically.
 *
 * Without it the page inherited the site-wide card, so every link to the
 * service showed the homepage headline about making money with AI. Generated
 * rather than drawn so the text stays in step with the page.
 */
export const alt = "Test Purchases of AI Agents by AI Business";
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
            Test purchases of AI agents
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 68,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            You don&apos;t know what your bot is telling your customers.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.65)" }}>
            What you promised · What the bot said · What the system recorded
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 28,
              gap: 16,
            }}
          >
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
              Sergei Ponomarev
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
