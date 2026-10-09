import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import rehypeSections from '@/lib/rehype-sections';
import { Clip } from './Clip';
import { Prompt } from './Prompt';
import { H2, H3 } from './Heading';
import { Example, Note, Checklist } from './Blocks';

const components = { Clip, Prompt, Example, Note, Checklist, h2: H2, h3: H3 };

export async function Mdx({ source }: { source: string }) {
  const { content } = await compileMDX({
    source,
    components,
    options: { mdxOptions: { remarkPlugins: [remarkGfm, [remarkSmartypants, { dashes: 'oldschool' }]], rehypePlugins: [rehypeSections] } },
  });
  return content;
}
