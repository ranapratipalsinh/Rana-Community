const RULERS = [
  { name: 'Sheshmalji I Raisinhji', years: '1751–1794', note: 'Founder of Sayla State' },
  { name: 'Vakhatsinhji I Sheshmalji', years: '1794–1813' },
  { name: 'Madarsinhji I Vakhatsinhji', years: '1813–1837' },
  { name: 'Sheshmalji II Madarsinhji', years: '1837–1839' },
  { name: 'Kesrisinhji Sheshmalji', years: '1839–1881' },
  { name: 'Vakhatsinhji II Kesrisinhji', years: '1881–1924' },
  { name: 'Madarsinhji II Vakhatsinhji', years: '1924–1938', note: 'Promoted the handloom & patola industries' },
  { name: 'Karansinhji Madarsinhji', years: '1938–1962', note: 'Signed the Instrument of Accession, 1948' },
  { name: 'Surendrasinhji Karansinhji', years: '1962–1970' },
  { name: 'Prithvirajsinhji Surendrasinhji', years: '1970–2018' },
  { name: 'Somrajsinhji Prithvirajsinhji', years: '2018–present', note: 'Present head of the family' },
]

export function RulerTimeline() {
  return (
    <div className="relative mt-8 border-l border-gold/25 pl-6 sm:pl-8">
      {RULERS.map((ruler, i) => (
        <div key={ruler.name} className={i === 0 ? 'relative' : 'relative mt-6'}>
          <span className="absolute top-1.5 -left-[27px] h-2.5 w-2.5 rounded-full border-2 border-gold bg-ink sm:-left-[35px]" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold/70">
            {ruler.years}
          </p>
          <p className="mt-0.5 font-heading text-base font-semibold tracking-wide text-gold">
            {ruler.name}
          </p>
          {ruler.note ? <p className="mt-0.5 text-sm text-gold/70">{ruler.note}</p> : null}
        </div>
      ))}
    </div>
  )
}
