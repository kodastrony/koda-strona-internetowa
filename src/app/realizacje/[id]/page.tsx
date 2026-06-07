import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, getProject, getProjectNeighbours } from "@/lib/projects";
import { ProjectDetail } from "@/components/sections/project-detail";
import { CTABand } from "@/components/sections/cta-band";

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
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  const { prev, next } = getProjectNeighbours(id);

  return (
    <>
      <ProjectDetail project={project} prev={prev} next={next} />
      <CTABand
        title="Zróbmy coś takiego dla Ciebie"
        subtitle="Masz podobny projekt na oku? Opowiedz nam o nim — wrócimy z propozycją i wyceną w 24 godziny."
      />
    </>
  );
}
