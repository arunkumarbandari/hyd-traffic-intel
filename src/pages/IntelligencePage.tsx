const hourlyBars = [
  15, 10, 8, 5, 6, 12, 55, 85, 95, 70, 45, 40, 38, 42, 45, 50, 75, 90, 100, 85,
  55, 35, 25, 15,
]

const hotspotRows = [
  { name: 'Cyber Towers', severity: 'Critical', width: 95, color: 'bg-color-red' },
  { name: 'DLF Avenue', severity: 'High', width: 82, color: 'bg-color-orange' },
  { name: 'KPHB Colony', severity: 'High', width: 76, color: 'bg-color-orange' },
  {
    name: 'Jubilee Hills Checkpost',
    severity: 'Elevated',
    width: 65,
    color: 'bg-primary',
  },
  {
    name: 'Mindspace Junction',
    severity: 'Elevated',
    width: 58,
    color: 'bg-primary',
  },
]

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const heatmapData = [
  [5, 5, 5, 5, 10, 20, 40, 70, 90, 80, 50, 40, 40, 50, 50, 60, 80, 90, 100, 80, 40, 20, 10, 5],
  [5, 5, 5, 5, 10, 20, 50, 80, 100, 70, 40, 30, 40, 40, 50, 60, 70, 90, 90, 60, 30, 10, 5, 5],
  [5, 5, 5, 5, 10, 20, 40, 80, 90, 60, 40, 30, 30, 40, 50, 60, 80, 100, 80, 50, 30, 10, 5, 5],
  [5, 5, 5, 5, 10, 20, 50, 80, 80, 50, 40, 30, 40, 50, 60, 70, 90, 100, 90, 60, 40, 20, 10, 5],
  [5, 5, 5, 10, 10, 30, 60, 90, 80, 60, 50, 50, 60, 70, 80, 90, 100, 100, 100, 90, 70, 40, 20, 10],
  [10, 10, 5, 5, 5, 5, 10, 20, 30, 40, 50, 60, 70, 80, 70, 60, 50, 60, 70, 60, 40, 30, 20, 10],
  [10, 5, 5, 5, 5, 5, 5, 10, 10, 20, 30, 40, 50, 40, 30, 30, 40, 50, 40, 30, 20, 10, 10, 5],
]

export default function IntelligencePage() {
  return (
    <div className="intelligence-abstract-base relative min-h-screen overflow-x-hidden font-body text-body text-label-primary">
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

      <main className="relative z-10 mx-auto max-w-7xl space-y-space-5 px-space-8 pb-space-10 pt-24">
        <header className="mb-space-6">
          <h1 className="font-large-title text-large-title tracking-tight text-label-primary">
            Data Insights
          </h1>
          <p className="mt-1 font-body text-body text-label-secondary">
            Real-time telemetry and historical analysis.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-space-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card intelligence-glass-card relative rounded-xl p-space-5">
            <div className="mb-space-3 flex items-center justify-between">
              <span className="font-subheadline text-subheadline font-medium text-label-primary">
                Total Incidents
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-color-red/10 text-color-red">
                <span className="material-symbols-outlined text-[18px]">warning</span>
              </div>
            </div>
            <div className="font-large-title text-large-title font-semibold text-label-primary">
              1,245
            </div>
            <div className="mt-2 flex items-center gap-1 font-caption-1 text-caption-1 text-color-red">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +12% from last week
            </div>
          </div>

          <div className="glass-card intelligence-glass-card relative rounded-xl p-space-5">
            <div className="mb-space-3 flex items-center justify-between">
              <span className="font-subheadline text-subheadline font-medium text-label-primary">
                Avg/Day
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-color-orange/10 text-color-orange">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </div>
            </div>
            <div className="font-large-title text-large-title font-semibold text-label-primary">42</div>
            <div className="mt-2 flex items-center gap-1 font-caption-1 text-caption-1 text-color-green">
              <span className="material-symbols-outlined text-[14px]">trending_down</span>
              -3% from last week
            </div>
          </div>

          <div className="glass-card intelligence-glass-card relative rounded-xl p-space-5">
            <div className="mb-space-3 flex items-center justify-between">
              <span className="font-subheadline text-subheadline font-medium text-label-primary">
                All-time Worst
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </div>
            </div>
            <div className="mt-1 truncate font-title-3 text-title-3 font-semibold leading-tight text-label-primary">
              Cyber Towers
            </div>
            <div className="mt-2 font-caption-1 text-caption-1 text-label-secondary">
              Junction severity: Critical
            </div>
          </div>

          <div className="glass-card intelligence-glass-card relative rounded-xl p-space-5">
            <div className="mb-space-3 flex items-center justify-between">
              <span className="font-subheadline text-subheadline font-medium text-label-primary">
                Peak Hour
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-color-purple/10 text-color-purple">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
              </div>
            </div>
            <div className="mt-1 font-title-2 text-title-2 font-semibold text-label-primary">
              18:00 - 19:00
            </div>
            <div className="mt-2 font-caption-1 text-caption-1 text-label-secondary">
              Evening Rush
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-space-5 lg:grid-cols-12">
          <div className="glass-card intelligence-glass-card relative flex flex-col rounded-xl p-space-6 lg:col-span-8">
            <div className="mb-space-6 flex items-end justify-between">
              <div>
                <h2 className="font-title-3 text-title-3 font-semibold text-label-primary">
                  Hourly Frequency
                </h2>
                <p className="font-footnote text-footnote text-label-secondary">
                  Average incidents by hour across the network.
                </p>
              </div>
            </div>

            <div className="relative mt-auto flex h-48 flex-grow items-end justify-between gap-1 pt-4">
              <div className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-between">
                <div className="h-0 w-full border-t border-outline-variant/30" />
                <div className="h-0 w-full border-t border-outline-variant/30" />
                <div className="h-0 w-full border-t border-outline-variant/30" />
                <div className="h-0 w-full border-t border-outline-variant/30" />
              </div>

              {hourlyBars.map((value, index) => {
                const peakMorning = index >= 6 && index <= 9
                const peakEvening = index >= 16 && index <= 19
                const barClass = peakEvening
                  ? 'bg-color-orange shadow-[0_0_12px_rgba(255,149,0,0.4)] hover:brightness-110'
                  : peakMorning
                    ? 'bg-primary shadow-[0_0_12px_rgba(0,88,188,0.4)] hover:brightness-110'
                    : 'bg-primary/20 hover:bg-primary/40'

                return (
                  <div
                    key={value.toString() + index.toString()}
                    className={`relative z-10 w-full rounded-t-[4px] transition-all ${barClass}`}
                    style={{ height: `${value}%` }}
                  />
                )
              })}
            </div>

            <div className="mt-2 flex items-center justify-between font-caption-2 text-caption-2 text-label-secondary">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
          </div>

          <div className="glass-card intelligence-glass-card relative flex flex-col rounded-xl p-space-6 lg:col-span-4">
            <h2 className="mb-1 font-title-3 text-title-3 font-semibold text-label-primary">
              Distribution
            </h2>
            <p className="mb-space-5 font-footnote text-footnote text-label-secondary">
              Incident classification breakdown.
            </p>

            <div className="relative my-4 flex flex-grow items-center justify-center">
              <div
                className="h-40 w-40 rounded-full"
                style={{
                  background:
                    'conic-gradient(#FF3B30 0deg 126deg, #FF9500 126deg 234deg, #0058bc 234deg 360deg)',
                }}
              >
                <div className="absolute inset-0 m-auto flex h-28 w-28 flex-col items-center justify-center rounded-full bg-surface-container-low backdrop-blur-md">
                  <span className="font-headline text-headline text-label-primary">1,245</span>
                  <span className="font-caption-2 text-caption-2 text-label-secondary">Total</span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-color-red" />
                  <span className="font-subheadline text-subheadline text-label-primary">
                    Accidents
                  </span>
                </div>
                <span className="font-footnote text-footnote font-medium text-label-primary">
                  35%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-color-orange" />
                  <span className="font-subheadline text-subheadline text-label-primary">
                    Congestion
                  </span>
                </div>
                <span className="font-footnote text-footnote font-medium text-label-primary">
                  30%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="font-subheadline text-subheadline text-label-primary">
                    Roadworks
                  </span>
                </div>
                <span className="font-footnote text-footnote font-medium text-label-primary">
                  35%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-space-5 lg:grid-cols-12">
          <div className="glass-card intelligence-glass-card relative rounded-xl p-space-6 lg:col-span-5">
            <h2 className="mb-1 font-title-3 text-title-3 font-semibold text-label-primary">
              Hotspot Junctions
            </h2>
            <p className="mb-space-5 font-footnote text-footnote text-label-secondary">
              Ranked by severity and frequency.
            </p>

            <div className="space-y-4">
              {hotspotRows.map((row) => (
                <div key={row.name} className="group">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-subheadline text-subheadline font-medium text-label-primary transition-colors group-hover:text-primary">
                      {row.name}
                    </span>
                    <span
                      className={`font-caption-1 text-caption-1 font-semibold ${
                        row.severity === 'Critical'
                          ? 'text-color-red'
                          : row.severity === 'High'
                            ? 'text-color-orange'
                            : 'text-primary'
                      }`}
                    >
                      {row.severity}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                    <div
                      className={`h-full rounded-full ${row.color}`}
                      style={{ width: `${row.width}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card intelligence-glass-card relative rounded-xl p-space-6 lg:col-span-7">
            <div className="mb-space-5 flex items-end justify-between">
              <div>
                <h2 className="font-title-3 text-title-3 font-semibold text-label-primary">
                  Intensity Heatmap
                </h2>
                <p className="font-footnote text-footnote text-label-secondary">
                  Day vs Hour congestion patterns.
                </p>
              </div>
              <div className="flex items-center gap-2 font-caption-2 text-caption-2 text-label-secondary">
                <span>Low</span>
                <div className="h-2 w-16 rounded bg-gradient-to-r from-surface-variant to-color-red" />
                <span>High</span>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="mb-2 grid grid-cols-[40px_repeat(24,1fr)] gap-1 text-center font-caption-2 text-caption-2 text-label-secondary">
                  <div />
                  {Array.from({ length: 24 }, (_, index) => {
                    const shouldShow = [0, 6, 12, 18, 23].includes(index)
                    return <div key={index.toString()}>{shouldShow ? index : ''}</div>
                  })}
                </div>

                <div className="flex flex-col gap-1">
                  {heatmapData.map((row, rowIndex) => (
                    <div
                      key={dayLabels[rowIndex]}
                      className="grid grid-cols-[40px_repeat(24,1fr)] items-center gap-1"
                    >
                      <span
                        className={`font-caption-1 text-caption-1 ${
                          dayLabels[rowIndex] === 'Fri'
                            ? 'font-semibold text-label-primary'
                            : 'text-label-secondary'
                        }`}
                      >
                        {dayLabels[rowIndex]}
                      </span>
                      {row.map((intensity, colIndex) => {
                        const isFridayPeak =
                          dayLabels[rowIndex] === 'Fri' && colIndex >= 16 && colIndex <= 18
                        return (
                          <div
                            key={`${dayLabels[rowIndex]}-${colIndex.toString()}`}
                            className={`h-6 rounded-[2px] bg-color-red/${intensity.toString()} ${
                              isFridayPeak
                                ? 'z-10 scale-105 shadow-[0_0_8px_rgba(255,59,48,0.5)]'
                                : ''
                            }`}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
