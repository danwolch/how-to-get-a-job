export declare function slugify(text: string): string;
export declare function plainHeading(text: string): string;
export declare function headingId(text: string, anchors?: Record<string, string>): string;
export declare function extractHeadings(
  body: string,
  anchors?: Record<string, string>,
): { depth: 2 | 3; text: string; id: string }[];
