import type { Metadata } from 'next';
import { site } from './site.mjs';

/** Canonical URL for a site path like "/networking/". */
export function absolute(pathname: string): string {
  return new URL(pathname, site.url).toString();
}

/** Page metadata with a canonical URL and matching Open Graph / Twitter tags. */
export function pageMetadata({
  path,
  title,
  description,
  type = 'article',
  image = '/og/home.png',
}: {
  path: string;
  title: string;
  description: string;
  type?: 'article' | 'website';
  /** Share image under public/, rendered by scripts/build-og.mjs. */
  image?: string;
}): Metadata {
  const images = [{ url: absolute(image), width: 1200, height: 630, alt: title }];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absolute(path) },
    openGraph: { title, description, url: absolute(path), siteName: site.name, type, locale: 'en_US', images },
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
  };
}
