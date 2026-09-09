import { Calendar, Crown, Landmark, MapPin, ScrollText, UserRound } from 'lucide-react'

const FACTS = [
  { icon: Calendar, label: 'Founded', value: '1751' },
  { icon: UserRound, label: 'Founder', value: 'Sesabhai Haloji' },
  { icon: ScrollText, label: 'Ruling Dynasty', value: 'Jhala Rajput' },
  { icon: MapPin, label: 'Villages', value: '9' },
  { icon: Landmark, label: 'Acceded to India', value: '15 Feb 1948' },
  { icon: Crown, label: 'Present Head', value: 'Somrajsinhji Prithvirajsinhji' },
]

export function QuickFacts() {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-px overflow-hidden border border-gold/20 bg-gold/15 sm:grid-cols-3">
      {FACTS.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-2 bg-ink-card px-4 py-6 text-center transition-colors hover:bg-ink-soft"
        >
          <Icon className="text-gold/50" size={18} strokeWidth={1.5} />
          <p className="font-heading text-lg font-semibold tracking-wide text-gold sm:text-xl">
            {value}
          </p>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.15em] text-gold/60">
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}
