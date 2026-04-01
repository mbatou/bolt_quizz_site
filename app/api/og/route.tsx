import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { results, type RiderType } from "@/lib/results";

export const runtime = "edge";

const VALID_TYPES = new Set<string>(["premium", "bolt", "xl", "comfort"]);

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") || "comfort";

  if (!VALID_TYPES.has(type)) {
    return new Response("Invalid type", { status: 400 });
  }

  const result = results[type as RiderType];

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
          backgroundColor: "#2DB757",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Emoji */}
        <div style={{ fontSize: 96, marginBottom: 16 }}>{result.emoji}</div>

        {/* Type label */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 8,
          }}
        >
          {result.type}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            marginBottom: 16,
          }}
        >
          {result.title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 700,
            textAlign: "center" as const,
            lineHeight: 1.4,
          }}
        >
          {result.description}
        </div>

        {/* Bolt branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 48,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 20,
              color: "#2DB757",
            }}
          >
            B
          </div>
          <div
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            bolt.com.gh/rider
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
