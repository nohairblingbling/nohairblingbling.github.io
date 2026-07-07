import Reveal from './Reveal';

export default function SectionHeader({
  index,
  label,
  title,
}: {
  index: string;
  label: string;
  title: string;
}) {
  return (
    <div className="mb-14">
      <Reveal variant="fade">
        <p className="font-mono text-[11px] tracking-[0.3em] text-accent">
          {index} / {label}
        </p>
      </Reveal>
      <Reveal variant="blur" delay={100}>
        <h2 className="mt-3 text-3xl font-medium tracking-tight text-ink md:text-4xl">{title}</h2>
      </Reveal>
    </div>
  );
}
