const incidentRows = [
  {
    id: 'HYD-8842-C',
    junction: 'Jubilee Hills Checkpost',
    type: 'Major Collision',
    icon: 'car_crash',
    iconColor: 'text-color-orange',
    date: 'Oct 24, 2023',
    time: '14:32 - 16:45',
    duration: '2h 13m',
    status: 'Cleared',
    selected: true,
  },
  {
    id: 'HYD-8841-A',
    junction: 'Madhapur IT Corridor',
    type: 'Severe Congestion',
    icon: 'traffic',
    iconColor: 'text-color-red',
    date: 'Oct 24, 2023',
    time: '08:15 - 10:30',
    duration: '2h 15m',
    status: 'Cleared',
    selected: false,
  },
  {
    id: 'HYD-8839-S',
    junction: 'Kukatpally Y Junction',
    type: 'Signal Failure',
    icon: 'traffic_jam',
    iconColor: 'text-color-teal',
    date: 'Oct 23, 2023',
    time: '18:00 - 19:10',
    duration: '1h 10m',
    status: 'Cleared',
    selected: false,
  },
  {
    id: 'HYD-8832-W',
    junction: 'Banjara Hills Rd No. 1',
    type: 'Waterlogging',
    icon: 'water_drop',
    iconColor: 'text-color-purple',
    date: 'Oct 22, 2023',
    time: '15:40 - 20:00',
    duration: '4h 20m',
    status: 'Cleared',
    selected: false,
  },
  {
    id: 'HYD-8826-M',
    junction: 'Secunderabad Station',
    type: 'Minor Collision',
    icon: 'car_crash',
    iconColor: 'text-color-orange',
    date: 'Oct 21, 2023',
    time: '09:15 - 10:00',
    duration: '45m',
    status: 'Archived',
    selected: false,
  },
]

const timelineItems = [
  {
    title: 'Report Received',
    subtitle: '14:32 • via WhatsApp tip-line',
    dotColor: 'bg-color-red',
    ringColor: 'bg-color-red/20',
  },
  {
    title: 'Unit Dispatched',
    subtitle: '14:35 • Patrol Car 42 (Off. Reddy)',
    dotColor: 'bg-color-orange',
    ringColor: 'bg-color-orange/20',
  },
  {
    title: 'On Scene & Assessment',
    subtitle: '14:45 • Visual evidence uploaded. Tow truck requested.',
    dotColor: 'bg-color-blue-dark',
    ringColor: 'bg-color-blue-dark/20',
  },
  {
    title: 'Vehicles Cleared',
    subtitle: '16:10 • Towing complete. Debris sweeping.',
    dotColor: 'bg-color-green',
    ringColor: 'bg-color-green/20',
  },
  {
    title: 'Incident Closed',
    subtitle: '16:45 • Normal traffic flow resumed.',
    dotColor: 'bg-outline',
    ringColor: 'bg-surface-variant',
  },
]

export default function HistoryPage() {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-bg-primary font-body text-body text-label-primary antialiased">
      <div className="pointer-events-none absolute inset-0 z-0 bg-white" />
      <div className="pointer-events-none fixed inset-0 z-0">
        <img
          src="/intelligence-orange-abstract.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-[0.62]"
        />
      </div>
      <div className="pointer-events-none fixed left-[4%] top-[2%] z-[1] h-[54vw] w-[54vw] rounded-full bg-color-orange/20 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-[14%] right-[4%] z-[1] h-[48vw] w-[48vw] rounded-full bg-[#ffd8b1]/58 blur-[130px]" />

      <main className="relative z-10 mx-auto mt-16 flex w-full max-w-[1600px] flex-1 overflow-hidden">
        <section className="z-10 flex min-w-0 flex-1 flex-col border-r border-outline-variant/30 bg-glass-fill-light shadow-[4px_0_24px_rgba(0,0,0,0.02)] backdrop-blur-[30px]">
          <div className="shrink-0 p-space-6 pb-space-4">
            <h1 className="mb-space-5 font-large-title text-large-title tracking-tight text-label-primary">
              Incident Archive
            </h1>

            <div className="flex flex-col items-center gap-space-2 rounded-[16px] border border-glass-border bg-glass-fill-light p-space-2 shadow-[0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur-[30px] md:flex-row">
              <div className="relative w-full flex-1">
                <span className="material-symbols-outlined absolute left-space-3 top-1/2 -translate-y-1/2 text-outline">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search junction, ID, or officer..."
                  className="w-full rounded-xl border-none bg-white/60 py-2.5 pl-10 pr-space-3 font-subheadline text-subheadline text-label-primary shadow-sm outline-none ring-1 ring-black/5 transition-all placeholder:text-label-secondary focus:bg-white focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex w-full gap-space-2 md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <span className="material-symbols-outlined absolute left-space-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                    calendar_today
                  </span>
                  <select className="w-full cursor-pointer appearance-none rounded-xl border-none bg-white/60 py-2.5 pl-9 pr-space-8 font-subheadline text-subheadline text-label-primary shadow-sm outline-none ring-1 ring-black/5 transition-all focus:bg-white focus:ring-2 focus:ring-primary md:w-auto">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Year</option>
                    <option>Custom Range...</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-space-2 top-1/2 -translate-y-1/2 text-[20px] text-outline">
                    arrow_drop_down
                  </span>
                </div>

                <div className="relative flex-1 md:flex-none">
                  <select className="w-full cursor-pointer appearance-none rounded-xl border-none bg-white/60 px-space-4 py-2.5 pr-space-8 font-subheadline text-subheadline text-label-primary shadow-sm outline-none ring-1 ring-black/5 transition-all focus:bg-white focus:ring-2 focus:ring-primary md:w-auto">
                    <option>All Types</option>
                    <option>Collision</option>
                    <option>Congestion</option>
                    <option>Signal Failure</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-space-2 top-1/2 -translate-y-1/2 text-[20px] text-outline">
                    arrow_drop_down
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-12 gap-space-4 border-b border-outline-variant/40 px-space-6 py-space-2 font-footnote text-footnote text-label-secondary">
            <div className="col-span-4">Junction & Type</div>
            <div className="col-span-3">Date & Time</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-3 text-right">Status</div>
          </div>

          <div className="flex flex-1 flex-col gap-space-2 overflow-y-auto p-space-4">
            {incidentRows.map((row) => {
              const statusClasses =
                row.status === 'Archived'
                  ? 'bg-surface-variant text-label-secondary border-outline-variant/50'
                  : 'bg-color-green/10 text-color-green-dark border-color-green/20'

              return (
                <div
                  key={row.id}
                  className={`grid cursor-pointer grid-cols-12 items-center gap-space-4 rounded-xl p-space-3 transition-all ${
                    row.selected
                      ? 'border border-primary/20 bg-glass-fill-light shadow-sm backdrop-blur-[30px]'
                      : 'border border-transparent bg-glass-fill-light backdrop-blur-[30px] hover:border-outline-variant/30 hover:bg-surface-container-low'
                  }`}
                >
                  <div className="col-span-4 flex flex-col gap-1">
                    <span className="truncate font-headline text-headline text-label-primary">
                      {row.junction}
                    </span>
                    <div className="flex items-center gap-1 font-caption-1 text-caption-1 text-label-secondary">
                      <span className={`material-symbols-outlined text-[14px] ${row.iconColor}`}>
                        {row.icon}
                      </span>
                      <span>{row.type}</span>
                    </div>
                  </div>

                  <div className="col-span-3 flex flex-col font-subheadline text-subheadline text-label-secondary">
                    <span>{row.date}</span>
                    <span className="font-caption-1 text-caption-1 text-label-secondary">
                      {row.time}
                    </span>
                  </div>

                  <div className="col-span-2 font-subheadline text-subheadline text-label-secondary">
                    {row.duration}
                  </div>

                  <div className="col-span-3 flex justify-end">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-1 font-caption-1 text-caption-1 font-medium ${statusClasses}`}
                    >
                      {row.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="hidden w-[450px] bg-transparent p-space-6 lg:flex xl:w-[500px]">
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-white/60 bg-glass-fill-light shadow-[0_24px_60px_-12px_rgba(0,0,0,0.15)] backdrop-blur-[30px]">
            <div className="pointer-events-none absolute inset-0 z-20 rounded-[28px] border-t border-white/80" />

            <div className="z-10 flex items-start justify-between bg-gradient-to-b from-white/50 to-transparent px-space-6 pb-space-4 pt-space-6">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    ID: HYD-8842-C
                  </span>
                  <span className="inline-flex items-center rounded-full border border-color-green/20 bg-color-green/10 px-2 py-0.5 font-caption-2 text-caption-2 font-medium text-color-green-dark">
                    Cleared
                  </span>
                </div>
                <h2 className="mt-1 font-title-2 text-title-2 leading-tight text-label-primary">
                  Jubilee Hills Checkpost
                </h2>
                <p className="mt-1 font-subheadline text-subheadline text-label-secondary">
                  Oct 24, 2023 • 14:32 - 16:45
                </p>
              </div>

              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-label-secondary transition-colors hover:bg-surface-variant"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="z-10 flex flex-1 flex-col gap-space-6 overflow-y-auto px-space-6 pb-space-6">
              <div className="space-y-space-3">
                <h3 className="flex items-center gap-2 font-headline text-headline text-label-primary">
                  <span className="material-symbols-outlined text-[18px] text-color-green">
                    forum
                  </span>
                  Source Intelligence
                </h3>

                <div className="relative inline-block max-w-[90%] rounded-[16px] rounded-tl-none border border-black/5 bg-[#e1ffd4] p-space-4 text-label-primary shadow-sm">
                  <p className="font-body text-body leading-relaxed">
                    &quot;Major crash at Jubilee Hills checkpost crossing. Two cars involved,
                    completely blocking the left lane towards KBR park. Need traffic police
                    ASAP, huge pileup starting.&quot;
                  </p>
                  <div className="mt-2 flex items-center justify-between font-caption-2 text-caption-2 text-label-secondary">
                    <span>~ Citizen Reporter</span>
                    <span>14:30</span>
                  </div>
                </div>
              </div>

              <div className="space-y-space-3">
                <h3 className="flex items-center gap-2 font-headline text-headline text-label-primary">
                  <span className="material-symbols-outlined text-[18px] text-color-blue-dark">
                    photo_camera
                  </span>
                  Visual Evidence
                </h3>

                <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-outline-variant/30 shadow-sm">
                  <img
                    alt="Traffic intersection with two damaged vehicles"
                    className="h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzHkLeO6CJtvS4p4sDRIUbQSqhZBPBty3e3OPr1WDgH8l6aMbkE2dx8vcACNf4_QxKVOGZsJVrmdcNE2OC5tKK_NgZVDeyfTxvG9AqNicTsPc7q63Jz9sDNThVY3eecQ6lmIftYZ-zVnQKMQjrpEy1oV12j_Ing8T3xz0xIyHYO1OGXc4rysGk418LvECayzREbSmdmKr6Mmt_TlnIb9_3HOQ7geFpBdKfwMpGK13kSUWKLawnfe_7Dut0YVlYpCPc1xtOukebbLkd"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
                    <span className="material-symbols-outlined text-[32px] text-white opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100">
                      zoom_in
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 font-caption-2 text-caption-2 text-white backdrop-blur-md">
                    Uploaded by Off. Reddy • 14:45
                  </div>
                </div>
              </div>

              <div className="space-y-space-4">
                <h3 className="flex items-center gap-2 font-headline text-headline text-label-primary">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    history
                  </span>
                  Incident Timeline
                </h3>

                <div className="relative space-y-6 pl-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-surface-variant">
                  {timelineItems.map((item) => (
                    <div key={item.title} className="relative">
                      <div
                        className={`absolute -left-[30px] z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background ${item.ringColor}`}
                      >
                        <div className={`h-2 w-2 rounded-full ${item.dotColor}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline text-subheadline text-label-primary">
                          {item.title}
                        </span>
                        <span className="font-caption-1 text-caption-1 text-label-secondary">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-space-3 border-t border-outline-variant/20 pt-space-4">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-outline-variant/50 bg-white py-3 font-headline text-subheadline text-label-primary shadow-sm transition-colors hover:bg-surface-container">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export PDF
                </button>
                <button className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary py-3 font-headline text-subheadline text-white shadow-md transition-all hover:bg-primary-container">
                  <div className="absolute inset-0 bg-glass-fill-light opacity-0 transition-opacity group-active:opacity-100" />
                  <span className="material-symbols-outlined text-[18px]">share</span>
                  Share Record
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
