import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import remarkHeadingIds from '@/lib/remark-heading-ids';
import rehypeSections from '@/lib/rehype-sections';
import { Clip } from './Clip';
import { Prompt } from './Prompt';
import { H2, H3 } from './Heading';
import { Example, Note, Checklist } from './Blocks';

const components = { Clip, Prompt, Example, Note, Checklist, h2: H2, h3: H3 };

export async function Mdx({ source, anchors }: { source: string; anchors?: Record<string, string> }) {
  const { content } = await compileMDX({
    source,
    components,
    options: {
      mdxOptions: {
        // Heading ids come first, from the raw text, so pinned anchors match what's written in the file.
        remarkPlugins: [[remarkHeadingIds, { anchors }], remarkGfm, [remarkSmartypants, { dashes: 'oldschool' }]],
        rehypePlugins: [rehypeSections],
      },
    },
  });
  return content;
}
