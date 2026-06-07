import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/lib/articles";
import { ArticleView } from "@/components/sections/article-view";
import { CTABand } from "@/components/sections/cta-band";

// Static export: only the known article slugs are generated; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.excerpt },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <ArticleView article={article} />
      <CTABand />
    </>
  );
}
