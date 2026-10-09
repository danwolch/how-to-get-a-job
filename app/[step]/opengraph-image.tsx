import { getSteps, getStep } from '@/lib/content';
import { ogImage, ogSize } from '@/lib/og';

export const dynamic = 'force-static';
export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'A step of How to Get a Job';

export function generateStaticParams() {
  return getSteps().map((s) => ({ step: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ step: string }> }) {
  const s = getStep((await params).step)!;
  return ogImage({ title: s.title, footer: `Step ${s.step} of ${getSteps().length}` });
}
