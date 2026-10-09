// Shared by the Next.js app and scripts/build-markdown.mjs.
// On Vercel, the production URL comes from the build environment, so adding a
// custom domain later needs no code change. SITE_URL overrides it.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const site = {
  name: 'How to Get a Job',
  description:
    'A free, step-by-step job search course for tech and desk workers: what to do after a layoff, your story, resume, networking, interviews and salary negotiation.',
  url: process.env.SITE_URL || (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000'),
  repo: 'https://github.com/danwolch/how-to-get-a-job',
  author: 'Dan Wolchonok',
};
