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
}: {
  path: string;
  title: string;
  description: string;
  type?: 'article' | 'website';
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absolute(path) },
    openGraph: { title, description, url: absolute(path), siteName: site.name, type, locale: 'en_US' },
    twitter: { card: 'summary_large_image', title, description },
  };
}
