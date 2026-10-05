export const ogImageSize = { width: 1200, height: 630 };

export const ogImageAlt =
  "gitcomm — commit messages that match your repository's style";

const CANVAS = "#f5f5f3";
const INK = "#17171a";
const INK_MUTED = "#4e4e55";
const INK_FAINT = "#5e5e66";
const LINE = "#e0e0dc";

/**
 * Shared by the opengraph-image and twitter-image routes so both cards are
 * byte-identical. Satori supports a flex subset of CSS only.
 */
export function OgImageCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: CANVAS,
        borderTop: `14px solid ${INK}`,
        padding: "72px 80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 24,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: INK_FAINT,
          }}
        >
          npm package · node ≥ 20.12
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            marginTop: 24,
            fontSize: 150,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1,
            color: INK,
          }}
        >
          gitcomm
          <span style={{ color: INK_FAINT }}>.</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderTop: `2px solid ${LINE}`,
          paddingTop: 36,
        }}
      >
        <div style={{ fontSize: 44, lineHeight: 1.35, color: INK }}>
          Commit messages that match your repository&apos;s style.
        </div>
        <div
          style={{
            marginTop: 28,
            fontFamily: "monospace",
            fontSize: 24,
            color: INK_MUTED,
          }}
        >
          gitcomm.web.id
        </div>
      </div>
    </div>
  );
}
