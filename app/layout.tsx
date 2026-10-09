import type { Metadata } from 'next';
import Link from 'next/link';
import { Schibsted_Grotesk, Literata, JetBrains_Mono } from 'next/font/google';
import { site } from '@/lib/site.mjs';
import './globals.css';

const sans = Schibsted_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const serif = Literata({ subsets: ['latin'], variable: '--font-serif', display: 'swap', style: ['normal', 'italic'] });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap', weight: ['400', '500'] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="wrap site-header-inner">
            <Link href="/" className="wordmark">
              How to Get a Job
            </Link>
            <nav className="site-nav" aria-label="Site">
              <Link href="/#steps">Steps</Link>
              <Link href="/prompts/">Prompts</Link>
              <Link href="/clips/">Clips</Link>
              <a href={site.repo}>GitHub</a>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="wrap site-footer-inner">
            <p>
              Free and open source under{' '}
              <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Copy it, fork it, paste it into
              your AI. Corrections welcome on <a href={site.repo}>GitHub</a>.
            </p>
            <p className="footer-links">
              <Link href="/about/">About</Link>
              <a href="/course.md">Whole course as Markdown</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
