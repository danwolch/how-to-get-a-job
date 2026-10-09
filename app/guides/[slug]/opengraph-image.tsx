import { getGuides, getGuide } from '@/lib/content';
import { ogImage, ogSize } from '@/lib/og';

export const dynamic = 'force-static';
export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'A guide from How to Get a Job';

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const g = getGuide((await params).slug)!;
  return ogImage({ title: g.title, footer: 'Guide · free templates' });
}
