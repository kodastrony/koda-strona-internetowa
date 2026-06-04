export interface NavLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  tags: string[];
  url?: string;
  year: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features?: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  coverImage?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  company: string;
  role: string;
  quote: string;
}
