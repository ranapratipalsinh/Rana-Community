const FACTS = [
  { label: 'Founded', value: '1751' },
  { label: 'Founder', value: 'Sesabhai Haloji' },
  { label: 'Ruling Dynasty', value: 'Jhala Rajput' },
  { label: 'Villages', value: '9' },
  { label: 'Acceded to India', value: '15 Feb 1948' },
  { label: 'Present Head', value: 'Somrajsinhji Prithvirajsinhji' },
]

export function QuickFacts() {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-px overflow-hidden border border-gold/20 bg-gold/20 sm:grid-cols-3">
      {FACTS.map((fact) => (
        <div key={fact.label} className="bg-ink-card px-4 py-5 text-center">
          <p className="font-heading text-lg font-semibold tracking-wide text-gold sm:text-xl">
            {fact.value}
          </p>
          <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-gold/60">
            {fact.label}
          </p>
        </div>
      ))}
    </div>
  )
}
