import { publications } from '../content';
import SectionHeader from '../components/ui/SectionHeader';
import Reveal from '../components/ui/Reveal';
import PubCard from '../components/PubCard';

export default function PublicationsPage() {
  return (
    <main id="top" className="mx-auto min-h-screen max-w-5xl px-6 pb-28 pt-36">
      <SectionHeader index="02" label="PUBLICATIONS" title="" titleAccent="Publications" />
      <div className="grid gap-5 md:grid-cols-2">
        {publications.map((p, i) => (
          <Reveal key={p.title} variant="develop" delay={i * 80} className="h-full">
            <PubCard pub={p} />
          </Reveal>
        ))}
      </div>
      <p className="mt-6 font-mono text-[11px] text-ink-3">* Equal contribution</p>
    </main>
  );
}
