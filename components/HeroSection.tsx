interface HeroSectionProps {
  eyebrow?: string
  headline: string
  subhead: string
}

export default function HeroSection({ eyebrow, headline, subhead }: HeroSectionProps) {
  return (
    <section className="grain-overlay relative overflow-hidden bg-gradient-to-b from-terracotta/15 via-stone/40 to-cream px-6 py-28">
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {eyebrow ? (
          <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-4 font-display text-5xl leading-tight text-espresso sm:text-6xl">
          {headline}
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-sans text-lg text-muted">{subhead}</p>
      </div>
    </section>
  )
}
