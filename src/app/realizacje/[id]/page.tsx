import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, getProject, getProjectNeighbours } from "@/lib/projects";
import { ProjectDetail } from "@/components/sections/project-detail";
import { CTABand } from "@/components/sections/cta-band";
import { SITE_CONFIG } from "@/lib/constants";
import { PROJECT_LASTMOD } from "@/app/sitemap";
import { breadcrumbLd, jsonLd, webPageLd } from "@/lib/seo";

// Static export: only the known project slugs are generated; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return {};
  // OG w JPG 1200×630 (crop z showcase, pre-generowany w public/) — .webp 1680×1050
  // odrzucał LinkedIn (format) i był przycinany w feedach (ratio 1,6 vs 1,91).
  const ogImage = project.showcase.replace("-showcase.webp", "-og.jpg");
  return {
    title: `${project.title} — ${project.type}`,
    description: project.summary,
    alternates: { canonical: `/realizacje/${project.id}/` },
    openGraph: {
      // Komplet pól OG (type/locale/siteName) — spójnie z pageMetadata(); bez nich
      // podgląd społecznościowy/AI gubił og:type, og:locale i og:site_name (7 vs 10 tagów).
      type: "article",
      locale: "pl_PL",
      siteName: "KODA Studio",
      title: `${project.title} — ${project.type} | KODA`,
      description: project.summary,
      url: `/realizacje/${project.id}/`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: `${project.title} — ${project.type}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${project.type} | KODA`,
      description: project.summary,
      images: [ogImage],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  const { prev, next } = getProjectNeighbours(id);

  // Per-case-study CreativeWork JSON-LD — encja = REALNY zbudowany produkt
  // (url → project.liveUrl, żywa strona), a strona KODA o nim to mainEntityOfPage.
  // Dla konceptów disambiguatingDescription niesie ten sam disclaimer, który jest
  // widoczny w treści (zgodność treść↔dane); copy never asserts a real client.
  const CASE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_CONFIG.url}/realizacje/${project.id}/#work`,
    name: `${project.title} — ${project.type}`,
    description: project.summary,
    url: project.liveUrl,
    mainEntityOfPage: `${SITE_CONFIG.url}/realizacje/${project.id}/`,
    inLanguage: "pl-PL",
    dateCreated: project.year,
    keywords: [project.type, project.client, ...project.tech].join(", "),
    creator: { "@id": `${SITE_CONFIG.url}/#organization` },
    image: [project.showcase, ...project.gallery.map((g) => g.src)].map(
      (src) => `${SITE_CONFIG.url}${src}`
    ),
    ...(project.concept
      ? {
          disambiguatingDescription:
            "Projekt koncepcyjny KODA: fikcyjna marka, w całości zaprojektowana i zakodowana przez KODA jako pokaz procesu pracy — nie zlecenie realnego klienta.",
        }
      : {}),
  };

  // WebPage — węzeł „ta strona case-study" (mainEntity → #work): czysty podział
  // strona-o-utworze vs sam utwór.
  const WEBPAGE_JSON_LD = webPageLd({
    path: `/realizacje/${project.id}/`,
    name: `${project.title} — ${project.type}`,
    description: project.summary,
    dateModified: PROJECT_LASTMOD,
    mainEntityId: `${SITE_CONFIG.url}/realizacje/${project.id}/#work`,
  });

  // Home → Realizacje → {projekt} — czytelna hierarchia dla Google i AI.
  const BREADCRUMB_JSON_LD = breadcrumbLd([
    { name: "Strona główna", path: "/" },
    { name: "Realizacje", path: "/realizacje/" },
    { name: project.title, path: `/realizacje/${project.id}/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(CASE_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(BREADCRUMB_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(WEBPAGE_JSON_LD) }}
      />
      <ProjectDetail project={project} prev={prev} next={next} />
      <CTABand
        title="Zbudujmy taką stronę dla Twojej firmy"
        subtitle="Opowiedz nam o swoim biznesie — pokażemy, jak może wyglądać, i odeślemy wycenę w ciągu 24 godzin. Bez zobowiązań."
      />
    </>
  );
}
