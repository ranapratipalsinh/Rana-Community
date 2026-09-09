export function SectionNav({ sections }: { sections: Array<{ key: string; heading: string }> }) {
  return (
    <nav className="sticky top-[73px] z-10 overflow-x-auto border-b border-gold/20 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl gap-8 px-4 py-3 whitespace-nowrap">
        {sections.map((s) => (
          <a
            key={s.key}
            href={`#${s.key}`}
            className="relative py-1 text-xs font-medium uppercase tracking-[0.15em] text-gold/60 transition-colors after:absolute after:inset-x-0 after:-bottom-[13px] after:h-px after:bg-gold after:opacity-0 after:transition-opacity hover:text-gold hover:after:opacity-100"
          >
            {s.heading}
          </a>
        ))}
      </div>
    </nav>
  )
}
