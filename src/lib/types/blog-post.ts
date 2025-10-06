import type { PortableTextBlock, PortableTextImageBlock } from './destination';

export type PortableTextContent = Array<PortableTextBlock | PortableTextImageBlock>;

export type BlogPostFeaturedImage = {
  url?: string;
  alt?: string;
};

export type BlogPostBase = {
  id: string;
  title: string;
  slug: string;
  author: string;
  publishedAt: string;
  tags?: string[];
  isPublished: boolean;
};

export type BlogPostListItem = BlogPostBase & {
  excerpt: string;
  featuredImage?: BlogPostFeaturedImage;
};

export type BlogPostDetail = BlogPostBase & {
  excerpt?: string;
  featuredImage?: BlogPostFeaturedImage;
  content?: PortableTextContent;
};

