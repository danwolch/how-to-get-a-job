import { site } from '@/lib/site.mjs';
import { absolute } from '@/lib/seo';
import type { Step, Guide } from '@/lib/content';

export function JsonLd({ data }: { data: object }) {
  // JSON-LD is data, not markup; escape "<" so content can never close the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

const author = { '@type': 'Person', name: site.author, url: absolute('/about/') };
const course = { '@type': 'Course', name: site.name, url: absolute('/') };

function article(path: string, headline: string, description: string, updated?: string) {
  return {
    '@type': 'Article',
    headline,
    description,
    url: absolute(path),
    mainEntityOfPage: absolute(path),
    author,
    publisher: { '@type': 'Organization', name: site.name, url: absolute('/') },
    inLanguage: 'en',
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    ...(updated ? { dateModified: updated } : {}),
    isPartOf: course,
  };
}

function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absolute(it.path) })),
  };
}

export function homeJsonLd(steps: Step[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: site.name, url: absolute('/') },
      {
        '@type': 'Course',
        name: site.name,
        description: site.description,
        url: absolute('/'),
        provider: { '@type': 'Person', name: site.author },
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', category: 'Free' },
        hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: 'P2W' },
        syllabusSections: steps.map((s) => ({ '@type': 'Syllabus', name: `Step ${s.step}: ${s.title}`, description: s.dek, url: absolute(`/${s.slug}/`) })),
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
    ],
  };
}

export function stepJsonLd(s: Step, total: number) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { ...article(`/${s.slug}/`, s.seoTitle ?? s.title, s.seoDescription ?? s.dek, s.updated), position: `${s.step} of ${total}` },
      breadcrumbs([
        { name: site.name, path: '/' },
        { name: `Step ${s.step}: ${s.title}`, path: `/${s.slug}/` },
      ]),
    ],
  };
}

export function guideJsonLd(g: Guide) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      article(`/guides/${g.slug}/`, g.seoTitle ?? g.title, g.seoDescription ?? g.dek, g.updated),
      breadcrumbs([
        { name: site.name, path: '/' },
        { name: 'Guides', path: '/guides/' },
        { name: g.title, path: `/guides/${g.slug}/` },
      ]),
    ],
  };
}
