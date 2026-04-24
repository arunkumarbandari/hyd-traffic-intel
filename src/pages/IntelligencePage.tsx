import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchIntelligence, type IncidentType } from '../api/incidents'

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function formatTypeLabel(type: IncidentType) {
  if (type === 'roadwork') return 'Roadworks'
  if (type === 'breakdown') return 'Breakdowns'
  if (type === 'accident') return 'Accidents'
  if (type === 'congestion') return 'Congestion'
  return 'Other'
}

function getTypeColor(type: IncidentType) {
  if (type === 'accident') return 'bg-color-red'
  if (type === 'congestion') return 'bg-color-orange'
  if (type === 'roadwork') return 'bg-primary'
  if (type === 'breakdown') return 'bg-color-purple'
  return 'bg-slate-400'
}

function getSeverityClass(count: number, max: number) {
  if (!max) return 'text-primary'
  const ratio = count / max
  if (ratio >= 0.75) return 'text-color-red'
  if (ratio >= 0.45) return 'text-color-orange'
  return 'text-primary'
}

function getSeverityLabel(count: number, max: number) {
  if (!max) return 'Elevated'
  const ratio = count / max
  if (ratio >= 0.75) return 'Critical'
  if (ratio >= 0.45) return 'High'
  return 'Elevated'
}

function normalizeDay(day: string) {
  const lower = day.toLowerCase()
  if (lower.startsWith('mon')) return 'Mon'
  if (lower.startsWith('tue')) return 'Tue'
  if (lower.startsWith('wed')) return 'Wed'
  if (lower.startsWith('thu')) return 'Thu'
  if (lower.startsWith('fri')) return 'Fri'
  if (lower.startsWith('sat')) return 'Sat'
  if (lower.startsWith('sun')) return 'Sun'
  return day.slice(0, 3)
}

export default function IntelligencePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['intelligence'],
    queryFn: () => fetchIntelligence(365),
    staleTime: 60_000,
  })

  const summary = data?.summary

  const hourlyBars = useMemo(() => {
    const hourlyMap = new Map<number, number>()
    data?.hourly.forEach((entry) => {
      hourlyMap.set(entry.hour, entry.count)
    })

    const counts = Array.from({ length: 24 }, (_, hour) => hourlyMap.get(hour) ?? 0)
    const max = Math.max(...counts, 1)
    return counts.map((count) => Math.max((count / max) * 100, count > 0 ? 6 : 0))
  }, [data?.hourly])

  const distribution = useMemo(() => {
    const byType = data?.by_type ?? []
    const total = byType.reduce((sum, row) => sum + row.count, 0)

    const ordered = [...byType].sort((a, b) => b.count - a.count)

    return {
      rows: ordered.map((row) => ({
        type: row.type,
        label: formatTypeLabel(row.type),
        count: row.count,
        percent: total > 0 ? Math.round((row.count / total) * 100) : 0,
        color: getTypeColor(row.type),
      })),
      total,
    }
  }, [data?.by_type])

  const donutStyle = useMemo(() => {
    const rows = distribution.rows
    if (!rows.length) {
      return {
        background: 'conic-gradient(#cbd5e1 0deg 360deg)',
      }
    }

    let angle = 0
    const stops = rows.map((row) => {
      const start = angle
      const span = Math.max((row.percent / 100) * 360, 0)
      angle += span
      const color =
        row.type === 'accident'
          ? '#FF3B30'
          : row.type === 'congestion'
            ? '#FF9500'
            : row.type === 'roadwork'
              ? '#0058bc'
              : row.type === 'breakdown'
                ? '#8b5cf6'
                : '#94a3b8'
      return `${color} ${start}deg ${Math.max(angle, start + 1)}deg`
    })

    if (angle < 360) {
      stops.push(`#cbd5e1 ${angle}deg 360deg`)
    }

    return {
      background: `conic-gradient(${stops.join(', ')})`,
    }
  }, [distribution.rows])

  const hotspotRows = useMemo(() => {
    const rows = [...(data?.hotspots ?? [])].sort((a, b) => b.count - a.count).slice(0, 10)
    const max = rows[0]?.count ?? 0

    return rows.map((row) => ({
      name: row.location_name,
      count: row.count,
      width: max > 0 ? Math.max((row.count / max) * 100, 6) : 0,
      severity: getSeverityLabel(row.count, max),
      severityClass: getSeverityClass(row.count, max),
      color: row.count / Math.max(max, 1) >= 0.75 ? 'bg-color-red' : row.count / Math.max(max, 1) >= 0.45 ? 'bg-color-orange' : 'bg-primary',
    }))
  }, [data?.hotspots])

  const heatmapData = useMemo(() => {
    const matrix = dayLabels.map(() => Array.from({ length: 24 }, () => 0))

    data?.heatmap.forEach((entry) => {
      const day = normalizeDay(entry.day)
      const rowIndex = dayLabels.indexOf(day)
      if (rowIndex === -1 || entry.hour < 0 || entry.hour > 23) return
      matrix[rowIndex][entry.hour] = entry.count
    })

    const max = Math.max(...matrix.flat(), 1)

    return matrix.map((row) =>
      row.map((count) => {
        if (count <= 0) return 0
        return Math.round((count / max) * 100)
      }),
    )
  }, [data?.heatmap])

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

        {isLoading ? (
          <div className="glass-card intelligence-glass-card rounded-xl p-space-6 font-subheadline text-subheadline text-label-primary">
            Loading intelligence...
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-space-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card intelligence-glass-card relative rounded-xl p-space-5">
            <div className="mb-space-3 flex items-center justify-between">
              <span className="font-subheadline text-subheadline font-medium text-label-primary">
                Total Today
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-color-red/10 text-color-red">
                <span className="material-symbols-outlined text-[18px]">warning</span>
              </div>
            </div>
            <div className="font-large-title text-large-title font-semibold text-label-primary">
              {summary?.total_today ?? 0}
            </div>
            <div className="mt-2 flex items-center gap-1 font-caption-1 text-caption-1 text-color-red">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              Incidents reported today
            </div>
          </div>

          <div className="glass-card intelligence-glass-card relative rounded-xl p-space-5">
            <div className="mb-space-3 flex items-center justify-between">
              <span className="font-subheadline text-subheadline font-medium text-label-primary">
                Active Now
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-color-orange/10 text-color-orange">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </div>
            </div>
            <div className="font-large-title text-large-title font-semibold text-label-primary">
              {summary?.active_now ?? 0}
            </div>
            <div className="mt-2 flex items-center gap-1 font-caption-1 text-caption-1 text-color-green">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              Live network state
            </div>
          </div>

          <div className="glass-card intelligence-glass-card relative rounded-xl p-space-5">
            <div className="mb-space-3 flex items-center justify-between">
              <span className="font-subheadline text-subheadline font-medium text-label-primary">
                Avg Duration
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </div>
            </div>
            <div className="mt-1 truncate font-title-3 text-title-3 font-semibold leading-tight text-label-primary">
              {summary?.avg_duration_minutes ?? 0} min
            </div>
            <div className="mt-2 font-caption-1 text-caption-1 text-label-secondary">
              Rolling incident duration
            </div>
          </div>

          <div className="glass-card intelligence-glass-card relative rounded-xl p-space-5">
            <div className="mb-space-3 flex items-center justify-between">
              <span className="font-subheadline text-subheadline font-medium text-label-primary">
                Focus Junction
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-color-purple/10 text-color-purple">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
              </div>
            </div>
            <div className="mt-1 font-title-2 text-title-2 font-semibold text-label-primary">
              {summary?.focus_junction?.name ?? '—'}
            </div>
            <div className="mt-2 font-caption-1 text-caption-1 text-label-secondary">
              {summary?.focus_junction ? `${summary.focus_junction.count} incidents` : 'No dominant hotspot'}
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
                style={donutStyle}
              >
                <div className="absolute inset-0 m-auto flex h-28 w-28 flex-col items-center justify-center rounded-full bg-surface-container-low backdrop-blur-md">
                  <span className="font-headline text-headline text-label-primary">
                    {distribution.total}
                  </span>
                  <span className="font-caption-2 text-caption-2 text-label-secondary">Total</span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              {distribution.rows.slice(0, 4).map((row) => (
                <div key={row.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${row.color}`} />
                    <span className="font-subheadline text-subheadline text-label-primary">
                      {row.label}
                    </span>
                  </div>
                  <span className="font-footnote text-footnote font-medium text-label-primary">
                    {row.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-space-5 lg:grid-cols-12">
          <div className="glass-card intelligence-glass-card relative flex max-h-[350px] flex-col overflow-hidden rounded-xl p-space-6 lg:col-span-5">
            <h2 className="mb-1 font-title-3 text-title-3 font-semibold text-label-primary">
              Hotspot Junctions
            </h2>
            <p className="mb-space-5 font-footnote text-footnote text-label-secondary">
              Ranked by severity and frequency.
            </p>

            <div className="-mr-space-6 flex-1 space-y-4 overflow-y-auto pr-space-6">
              {hotspotRows.map((row) => (
                <div key={row.name} className="group">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-subheadline text-subheadline font-medium text-label-primary transition-colors group-hover:text-primary">
                      {row.name}
                    </span>
                    <span className={`font-caption-1 text-caption-1 font-semibold ${row.severityClass}`}>
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

          <div className="glass-card intelligence-glass-card relative flex max-h-[350px] flex-col overflow-hidden rounded-xl p-space-6 lg:col-span-7">
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

            <div className="w-full flex-1 overflow-auto">
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
                            className={`h-6 rounded-[2px] ${
                              isFridayPeak
                                ? 'z-10 scale-105 shadow-[0_0_8px_rgba(255,59,48,0.5)]'
                                : ''
                            }`}
                            style={{
                              backgroundColor: `rgba(255, 59, 48, ${intensity <= 8 ? 0.04 : (intensity / 100) * 0.9 + 0.1})`,
                            }}
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
