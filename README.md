# How to Get a Job

A free, open-source course on getting a white-collar job, in seven steps:

1. **[Laid off? Reset first](content/steps/reset.mdx)** (optional)
2. **[Build your point of view and your story](content/steps/story.mdx)**
3. **[Make your resume back up the story](content/steps/resume.mdx)**
4. **[Network your way in](content/steps/networking.mdx)**
5. **[Turn conversations into applications](content/steps/applying.mdx)**
6. **[Interview like you practiced, because you did](content/steps/interviews.mdx)**
7. **[Negotiate the offer, then close the loop](content/steps/offers.mdx)**

Each step mixes plain advice with clips from podcasts (Lenny's Podcast, Supra Insider, Aakash Gupta, Ethan Evans and others), queued to the moment the guest makes the point, plus copy-paste AI prompts.

## Use it with an AI

The build writes the whole course to `public/course.md` (served at `/course.md`), one file per step under `/md/`, and an `llms.txt`. Paste the link or the file into ChatGPT, Claude or Gemini and ask it to coach you through your own search.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
```

The site is a static Next.js export, so `out/` can be hosted anywhere (GitHub Pages, Netlify, Cloudflare Pages, S3).

## How it's organized

| Path | What |
| --- | --- |
| `content/steps/*.mdx` | The course text. Frontmatter sets the title, step number, time estimate and one-line summary. |
| `content/clips.json` | Every clip: YouTube id, start second, verbatim quote, speaker and source. |
| `components/` | `<Clip id="…" />`, `<Prompt title="…">`, `<Example>`, `<Note>`, `<Checklist>` |
| `scripts/build-markdown.mjs` | Renders the Markdown and `llms.txt` versions. |

To add a clip, add an entry to `content/clips.json` and reference it with `<Clip id="your-id" />`. Quotes must be verbatim, and `start` should be a second or two before the quote begins in the YouTube video (not the podcast audio, which often has different ads).

## Contributing

Corrections, better clips and disagreements are welcome as issues or pull requests. If you think advice here is wrong, say why. The best version of this course includes the strongest counterarguments.

## License

The course text is licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The code is MIT ([LICENSE](LICENSE)); the text license is in [LICENSE-CONTENT](LICENSE-CONTENT). Clips and quotes belong to their speakers and creators, are embedded from YouTube, and link back to the full episodes.
