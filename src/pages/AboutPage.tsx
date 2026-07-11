import { useNavigate } from 'react-router-dom'
import BrandLogo from '../components/brand/BrandLogo'

const TECH_STACK = [
  { name: 'React 18', icon: 'code' },
  { name: 'TypeScript', icon: 'data_object' },
  { name: 'Vite', icon: 'bolt' },
  { name: 'Tailwind CSS', icon: 'palette' },
  { name: 'Mapbox GL JS', icon: 'map' },
  { name: 'TanStack Query', icon: 'sync' },
  { name: 'Zustand', icon: 'hub' },
  { name: 'Node.js + Express', icon: 'dns' },
  { name: 'Supabase', icon: 'database' },
  { name: 'whatsapp-web.js', icon: 'chat' },
  { name: 'Gemini 2.5 Flash', icon: 'smart_toy' },
  { name: 'Google Geocoding API', icon: 'neurology' },
  { name: 'Railway', icon: 'cloud' },
  { name: 'Vercel', icon: 'rocket_launch' },
]

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'arunkumarbandari309@gmail.com',
    href: 'mailto:arunkumarbandari309@gmail.com',
    icon: 'mail',
  },
  {
    label: 'LinkedIn',
    value: 'in/arunkumarbandari',
    href: 'https://www.linkedin.com/in/arunkumarbandari',
    icon: 'person',
  },
  {
    label: 'GitHub',
    value: 'arunkumarbandari/hyd-traffic-intel',
    href: 'https://github.com/arunkumarbandari/hyd-traffic-intel',
    icon: 'code',
  },
]

const cardClass =
  'rounded-2xl border border-white/80 bg-white/70 p-space-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-[30px]'

export default function AboutPage() {
  const navigate = useNavigate()
  const year = new Date().getFullYear()

  return (
    <div className="relative min-h-screen bg-bg-primary font-body text-body text-label-primary antialiased">
      <div className="pointer-events-none absolute inset-0 z-0 bg-white" />
      <div className="pointer-events-none fixed left-[6%] top-[4%] z-[1] h-[48vw] w-[48vw] rounded-full bg-primary/15 blur-[130px]" />
      <div className="pointer-events-none fixed -bottom-[12%] right-[6%] z-[1] h-[42vw] w-[42vw] rounded-full bg-color-blue/15 blur-[130px]" />

      <main className="relative z-10 mx-auto w-full max-w-[900px] px-space-4 pb-space-8 pt-16 sm:px-space-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-space-6 mb-space-5 flex items-center gap-1 rounded-full border border-white/70 bg-white/70 px-space-4 py-2 font-subheadline text-subheadline text-label-primary shadow-sm backdrop-blur-xl transition-colors hover:bg-white"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>

        <header className="mb-space-6">
          <div className="mb-space-4">
            <BrandLogo variant="full" size={56} />
          </div>
          <h1 className="font-large-title text-large-title tracking-tight text-label-primary">
            About Hyd Traffic Intel
          </h1>
          <p className="mt-space-2 font-body text-body leading-relaxed text-label-secondary">
            A civic tool that maps Cyberabad Traffic Police WhatsApp alerts into a live,
            searchable view of incidents across Hyderabad — turning scattered messages into
            an at-a-glance picture of what is happening on the roads.
          </p>
        </header>

        <div className="flex flex-col gap-space-5">
          <section className={cardClass}>
            <h2 className="mb-space-3 flex items-center gap-2 font-headline text-headline text-label-primary">
              <span className="material-symbols-outlined text-[20px] text-primary">verified</span>
              Data Attribution
            </h2>
            <p className="font-subheadline text-subheadline leading-relaxed text-label-secondary">
              All incident data originates from public alerts published by the{' '}
              <span className="font-semibold text-label-primary">Cyberabad Traffic Police</span>.
              This project is an independent, non-commercial civic initiative and is{' '}
              <span className="font-semibold text-label-primary">
                not officially affiliated with, endorsed by, or operated on behalf of
              </span>{' '}
              the Cyberabad Traffic Police or any government body.
            </p>
          </section>

          <section className={cardClass}>
            <h2 className="mb-space-3 flex items-center gap-2 font-headline text-headline text-label-primary">
              <span className="material-symbols-outlined text-[20px] text-color-orange">gavel</span>
              Usage &amp; Rights
            </h2>
            <ul className="space-y-space-2 font-subheadline text-subheadline leading-relaxed text-label-secondary">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined mt-0.5 text-[16px] text-label-secondary">
                  copyright
                </span>
                <span>
                  © {year} Hyd Traffic Intel. Data belongs to Cyberabad Traffic Police. No
                  commercial use permitted.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined mt-0.5 text-[16px] text-label-secondary">
                  block
                </span>
                <span>
                  No scraping, bulk extraction, or redistribution of the underlying data is
                  permitted. The data is surfaced here solely for public information.
                </span>
              </li>
            </ul>
          </section>

          <section className={cardClass}>
            <h2 className="mb-space-4 flex items-center gap-2 font-headline text-headline text-label-primary">
              <span className="material-symbols-outlined text-[20px] text-color-blue-dark">layers</span>
              Tech Stack
            </h2>
            <div className="grid grid-cols-2 gap-space-2 sm:grid-cols-3">
              {TECH_STACK.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/50 px-space-3 py-space-2 font-subheadline text-subheadline text-label-primary"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">{tech.icon}</span>
                  <span className="truncate">{tech.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="mb-space-3 flex items-center gap-2 font-headline text-headline text-label-primary">
              <span className="material-symbols-outlined text-[20px] text-primary">auto_awesome</span>
              Design Language
            </h2>
            <p className="font-subheadline text-subheadline leading-relaxed text-label-secondary">
              The interface is built on a{' '}
              <span className="font-semibold text-label-primary">glassmorphism</span> design
              language — frosted, translucent surfaces with real depth, soft light, and blur.
              It draws directly from{' '}
              <span className="font-semibold text-label-primary">macOS 26</span> and Apple&apos;s
              Human Interface Guidelines, so every panel, control, and card is{' '}
              <span className="font-semibold text-label-primary">Apple-coded</span>: clarity,
              deference, and depth, with motion and materials that stay out of the way of the data.
            </p>
          </section>

          <section className={cardClass}>
            <h2 className="mb-space-4 flex items-center gap-2 font-headline text-headline text-label-primary">
              <span className="material-symbols-outlined text-[20px] text-color-green">contact_mail</span>
              Contact
            </h2>
            <div className="flex flex-col gap-space-2">
              {CONTACT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-space-3 rounded-xl border border-white/70 bg-white/50 px-space-4 py-space-3 transition-colors hover:bg-white"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">{link.icon}</span>
                  <div className="min-w-0">
                    <div className="font-caption-1 text-caption-1 uppercase tracking-wider text-label-secondary">
                      {link.label}
                    </div>
                    <div className="truncate font-subheadline text-subheadline text-label-primary">
                      {link.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>

        <p className="mt-space-6 text-center font-caption-1 text-caption-1 text-label-secondary">
          © {year} Hyd Traffic Intel · Built independently · Data belongs to Cyberabad Traffic Police
        </p>
      </main>
    </div>
  )
}
