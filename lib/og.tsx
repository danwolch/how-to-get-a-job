import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };

const fonts = () => [
  { name: 'Schibsted', data: fs.readFileSync(path.join(process.cwd(), 'assets/fonts/SchibstedGrotesk-Bold.ttf')), weight: 700 as const },
  { name: 'Mono', data: fs.readFileSync(path.join(process.cwd(), 'assets/fonts/JetBrainsMono-Regular.ttf')), weight: 400 as const },
];

/** The shared social card: site name top-left, page title large, a short line at the bottom. */
export function ogImage({ title, footer }: { title: string; footer: string }) {
  const size = title.length > 60 ? 64 : title.length > 36 ? 76 : 96;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#f4f4f1', color: '#131313', padding: '64px 72px', fontFamily: 'Schibsted' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30 }}>
          <div style={{ width: 22, height: 22, background: '#e0461f' }} />
          How to Get a Job
        </div>
        <div style={{ display: 'flex', fontSize: size, lineHeight: 1.02, letterSpacing: '-0.035em', maxWidth: 1000 }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #131313', paddingTop: 22, fontFamily: 'Mono', fontSize: 24, color: '#3b3c3e' }}>
          <span>{footer}</span>
          <span style={{ color: '#b8360f' }}>howtogetajob.tech</span>
        </div>
      </div>
    ),
    { ...ogSize, fonts: fonts() },
  );
}
