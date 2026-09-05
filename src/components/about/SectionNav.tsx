export function SectionNav({ sections }: { sections: Array<{ key: string; heading: string }> }) {
  return (
    <nav className="sticky top-0 z-10 overflow-x-auto border-b border-gold/20 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl gap-6 px-4 py-3 whitespace-nowrap">
        {sections.map((s) => (
          <a
            key={s.key}
            href={`#${s.key}`}
            className="text-xs font-medium uppercase tracking-[0.1em] text-gold/70 transition-colors hover:text-gold"
          >
            {s.heading}
          </a>
        ))}
      </div>
    </nav>
  )
}
