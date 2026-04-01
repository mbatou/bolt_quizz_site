import type { Metadata } from "next";
import { results, type RiderType } from "@/lib/results";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ type: string }>;
}

const validTypes = new Set<string>(["premium", "bolt", "xl", "comfort"]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  if (!validTypes.has(type)) {
    return { title: "Bolt Ghana Rider Quiz" };
  }

  const result = results[type as RiderType];

  return {
    title: `${result.emoji} I'm ${result.title} — Bolt Ghana Rider Quiz`,
    description: result.description,
    openGraph: {
      title: `${result.emoji} I'm ${result.title}!`,
      description: result.description,
      images: [`/api/og?type=${type}`],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${result.emoji} I'm ${result.title}!`,
      description: result.description,
      images: [`/api/og?type=${type}`],
    },
  };
}

export default async function ResultPage({ params }: Props) {
  const { type } = await params;
  if (!validTypes.has(type)) {
    redirect("/");
  }

  // Redirect to main quiz page — the shareable URL is just for OG tags
  redirect(`/?result=${type}`);
}
