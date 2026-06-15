import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, getProject, getProjectNeighbours } from "@/lib/projects";
import { ProjectDetail } from "@/components/sections/project-detail";
import { CTABand } from "@/components/sections/cta-band";
import { SITE_CONFIG } from "@/lib/constants";

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
  return {
    title: `${project.title} — ${project.type}`,
    description: project.summary,
    alternates: { canonical: `/realizacje/${project.id}/` },
    openGraph: {
      title: `${project.title} — ${project.type} | KODA`,
      description: project.summary,
      url: `/realizacje/${project.id}/`,
      images: [
        {
          url: project.showcase,
          width: 1680,
          height: 1050,
          alt: `${project.title} — ${project.type}`,
        },
      ],
    },
    twitter: { card: "summary_large_image", images: [project.showcase] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  const { prev, next } = getProjectNeighbours(id);

  // Per-case-study CreativeWork JSON-LD — ties the work to the KODA Organization
  // node and exposes the screenshots as images. Concept pieces stay indexable;
  // copy never asserts a real client.
  const CASE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${project.title} — ${project.type}`,
    description: project.summary,
    url: `${SITE_CONFIG.url}/realizacje/${project.id}/`,
    inLanguage: "pl-PL",
    dateCreated: project.year,
    keywords: [project.type, project.client, ...project.tech].join(", "),
    creator: { "@id": `${SITE_CONFIG.url}/#organization` },
    isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
    image: [project.showcase, ...project.gallery.map((g) => g.src)].map(
      (src) => `${SITE_CONFIG.url}${src}`
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CASE_JSON_LD) }}
      />
      <ProjectDetail project={project} prev={prev} next={next} />
      <CTABand
        title="Zbudujmy taką stronę dla Twojej firmy"
        subtitle="Opowiedz nam o swoim biznesie — pokażemy, jak może wyglądać, i odeślemy wycenę w ciągu 24 godzin. Bez zobowiązań."
      />
    </>
  );
}
