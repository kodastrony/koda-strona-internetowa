import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/lib/articles";
import { ArticleView } from "@/components/sections/article-view";
import { CTABand } from "@/components/sections/cta-band";
import { SITE_CONFIG } from "@/lib/constants";

// Static export: only the known article slugs are generated; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  // og:image is inherited automatically from the file-based opengraph-image route.
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}/` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `/blog/${article.slug}/`,
      publishedTime: article.date,
      authors: [SITE_CONFIG.name],
      section: article.category,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  // BlogPosting structured data — richer search results + knowledge-graph signals.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    articleSection: article.category,
    inLanguage: "pl-PL",
    mainEntityOfPage: `${SITE_CONFIG.url}/blog/${article.slug}/`,
    author: { "@type": "Organization", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: { "@type": "ImageObject", url: `${SITE_CONFIG.url}/icon.svg` },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleView article={article} />
      <CTABand />
    </>
  );
}
