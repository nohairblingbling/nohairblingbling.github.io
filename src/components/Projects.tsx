import { projects, type Project } from '../content';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';
import SpotlightCard from './reactbits/SpotlightCard';

function ProjectCard({ project }: { project: Project }) {
  return (
    <SpotlightCard className="flex h-full flex-col">
      <div className="border-b border-hairline">
        <img
          src={project.image}
          alt=""
          loading="lazy"
          className="aspect-[16/9] w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">Project</p>
        <h3 className="mt-3 text-base font-medium leading-snug text-ink">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{project.description}</p>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            data-cursor
            className="mt-auto pt-4 font-mono text-[11px] tracking-[0.15em] text-ink-2 transition-colors hover:text-accent"
          >
            GITHUB ↗
          </a>
        )}
      </div>
    </SpotlightCard>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeader index="05" label="PROJECTS" title="Projects" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 80} className="h-full">
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
