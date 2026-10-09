// Shared by the Next.js app and scripts/build-markdown.mjs.
// On Vercel, the production URL comes from the build environment, so adding a
// custom domain later needs no code change. SITE_URL overrides it.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const site = {
  name: 'How to Get a Job',
  description:
    'A free, open-source course on getting a white-collar job: story, resume, networking, interviews and offers, with the best advice from people who hire for a living.',
  url: process.env.SITE_URL || (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000'),
  repo: 'https://github.com/danwolch/how-to-get-a-job',
  author: 'Dan Wolchonok',
};
