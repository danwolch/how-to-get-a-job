import type { MetadataRoute } from 'next';
import { getSteps, getGuides } from '@/lib/content';
import { absolute } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, lastModified?: string) => ({
    url: absolute(path),
    priority,
    ...(lastModified ? { lastModified } : {}),
  });
  return [
    page('/', 1),
    ...getSteps().map((s) => page(`/${s.slug}/`, 0.9, s.updated)),
    page('/guides/', 0.7),
    ...getGuides().map((g) => page(`/guides/${g.slug}/`, 0.8, g.updated)),
    page('/prompts/', 0.6),
    page('/clips/', 0.5),
    page('/about/', 0.3),
  ];
}
