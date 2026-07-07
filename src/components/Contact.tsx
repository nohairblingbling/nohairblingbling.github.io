import { contact, socials } from '../content';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';
import DecryptedText from './reactbits/DecryptedText';

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeader index="04" label="CONTACT" title="Get in" titleAccent="touch" />
      <Reveal>
        <p className="max-w-xl text-base leading-relaxed text-ink-2">{contact.blurb}</p>
      </Reveal>
      <Reveal delay={120}>
        <a
          href={`mailto:${contact.email}`}
          data-cursor
          className="mt-10 inline-block break-all font-mono text-lg text-ink underline decoration-hairline underline-offset-8 transition-colors hover:text-accent hover:decoration-accent md:text-3xl"
        >
          <DecryptedText text={contact.email} animateOn="hover" speed={20} />
        </a>
      </Reveal>
      <Reveal delay={200}>
        <div className="mt-14 flex flex-wrap gap-8">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              data-cursor
              className="font-mono text-[11px] tracking-[0.18em] text-ink-2 transition-colors hover:text-accent"
            >
              {s.label} ↗
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
