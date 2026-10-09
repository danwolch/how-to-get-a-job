import { ogImage, ogSize } from '@/lib/og';

export const dynamic = 'force-static';
export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'How to Get a Job: a free, step-by-step job search course';

export default function Image() {
  return ogImage({ title: 'A free, step-by-step job search course.', footer: '7 steps · templates · expert clips' });
}
