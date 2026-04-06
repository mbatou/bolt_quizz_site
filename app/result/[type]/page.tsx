import type { Metadata } from 'next';
import { results, type RiderType } from '@/lib/results';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ type: string }>;
}

const validTypes = new Set<string>(['basic', 'comfort', 'send', 'tricycle']);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  if (!validTypes.has(type)) {
    return { title: 'Bolt Ghana Rider Quiz' };
  }

  const result = results[type as RiderType];

  return {
    title: `${result.move} \u2014 ${result.category} | Bolt Ghana Quiz`,
    description: result.description,
    openGraph: {
      title: `I\u2019m ${result.move} \u2014 ${result.category}!`,
      description: result.description,
      images: [`/api/og?type=${type}`],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `I\u2019m ${result.move} \u2014 ${result.category}!`,
      description: result.description,
      images: [`/api/og?type=${type}`],
    },
  };
}

export default async function ResultPage({ params }: Props) {
  const { type } = await params;
  if (!validTypes.has(type)) {
    redirect('/');
  }

  redirect(`/?result=${type}`);
}
