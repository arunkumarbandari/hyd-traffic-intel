import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import { fetchIncidents, fetchTodayIncidents, type IncidentRow, type IncidentStatus, type IncidentType } from '../api/incidents'
import { formatDateValue, toEndIso, toStartIso } from '../utils/date'
import GlassDatePicker from '../components/calendar/GlassDatePicker'

type Incident = {
  id: string
  lat: number
  lng: number
  status: IncidentStatus
  type: IncidentType
  location: string
  description: string
  delayMinutes: number
  rawMessage: string
  photoUrl: string | null
  reportedAt: string
}

type LiveFilterType = 'all' | IncidentType
type StatusView = 'active' | 'cleared' | 'calendar'

const FILTER_OPTIONS: Array<{ key: LiveFilterType; label: string; icon: string }> = [
  { key: 'all', label: 'All Incidents', icon: 'emergency' },
  { key: 'accident', label: 'Accidents', icon: 'car_crash' },
  { key: 'congestion', label: 'Congestion', icon: 'traffic' },
  { key: 'breakdown', label: 'Breakdown', icon: 'build' },
]

// B4: "Active" groups active + expiring; "Cleared" is the cleared set.
function isActiveStatus(status: IncidentStatus) {
  return status === 'active' || status === 'expiring'
}

const NO_SELECTION = '__none__'

function IncidentPin({
  color,
  glow,
  selected,
  dimmed = false,
}: {
  color: string
  glow: string
  selected: boolean
  dimmed?: boolean
}) {
  const size = selected ? 38 : 32
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 32 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: `drop-shadow(${glow})`,
        transform: selected ? 'scale(1.15) translateY(-2px)' : 'scale(1)',
        transition: 'transform 0.15s ease',
        opacity: dimmed && !selected ? 0.7 : 1,
      }}
    >
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 27 16 27S32 26 32 16C32 7.163 24.837 0 16 0z" fill={color} />
      <circle cx="16" cy="16" r="7" fill="white" fillOpacity="0.9" />
      <circle cx="16" cy="16" r="3.5" fill={color} />
    </svg>
  )
}

function mapIncident(row: IncidentRow): Incident {
  return {
    id: row.id,
    lat: row.lat,
    lng: row.lng,
    status: row.status,
    type: row.incident_type,
    location: row.location_name,
    description: row.clean_message,
    delayMinutes: row.estimated_minutes,
    rawMessage: row.raw_message,
    photoUrl: row.photo_url,
    reportedAt: row.reported_at,
  }
}

function formatReceivedTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function getStatusClasses(status: IncidentStatus) {
  if (status === 'active') {
    return {
      pin: '#FF3B30',
      glow: '0 0 18px #FF3B30',
      badge: 'bg-color-red/10 text-color-red',
      label: 'Active',
    }
  }

  if (status === 'expiring') {
    return {
      pin: '#FF9500',
      glow: '0 0 18px #FF9500',
      badge: 'bg-color-orange/10 text-color-orange',
      label: 'Expiring',
    }
  }

  // Cleared: hard iOS green, matching HistoryPage.
  return {
    pin: '#34C759',
    glow: '0 0 18px #34C759',
    badge: 'bg-color-green/10 text-color-green-dark',
    label: 'Cleared',
  }
}

function getTypeIcon(type: IncidentType) {
  if (type === 'accident') return 'car_crash'
  if (type === 'congestion') return 'traffic'
  return 'build'
}

function getTypeColor(type: IncidentType) {
  if (type === 'accident') return 'text-color-red'
  if (type === 'congestion') return 'text-color-orange'
  return 'text-color-blue-dark'
}

function getTypeTag(type: IncidentType) {
  if (type === 'accident') return 'Collision'
  if (type === 'congestion') return 'Congestion'
  if (type === 'roadwork') return 'Roadwork'
  if (type === 'other') return 'Incident'
  return 'Breakdown'
}

function formatDelay(minutes: number) {
  return `~${minutes} min delay`
}

export default function LiveMapPage() {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  const mapStyle = 'mapbox://styles/mapbox/navigation-day-v1'
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<LiveFilterType>('all')
  const [statusView, setStatusView] = useState<StatusView>('active')
  const [calendarDate, setCalendarDate] = useState<Date>(new Date())
  const [calendarPickerOpen, setCalendarPickerOpen] = useState(false)

  const panelCardClass = 'live-orange-panel-glass'
  const statsCardClass = 'live-blue-stats-card'
  const textClass = 'text-white'
  const bodyTextClass = 'text-slate-600'
  const panelItemPrimaryTextClass = 'text-slate-900'
  const statsTextClass = 'text-white'
  const popupCardClass = 'live-blue-glass-card'

  // B1: source the map from today's full set (all statuses), polling every 30s.
  const { data: incidents = [], isLoading, isError } = useQuery({
    queryKey: ['incidents', 'today'],
    queryFn: fetchTodayIncidents,
    refetchInterval: 30_000,
    staleTime: 20_000,
    select: (response) => (response.data ?? []).map(mapIncident),
  })

  // Calendar mode: fetch cleared incidents for the selected date.
  const { data: calendarIncidents = [], isLoading: calendarLoading, isError: calendarError } = useQuery({
    queryKey: ['incidents', 'by-date', formatDateValue(calendarDate)],
    queryFn: () =>
      fetchIncidents({
        from: toStartIso(formatDateValue(calendarDate)),
        to: toEndIso(formatDateValue(calendarDate)),
        limit: '200',
      }),
    enabled: statusView === 'calendar',
    select: (response) => response.data.map(mapIncident).filter((incident) => incident.status === 'cleared'),
    staleTime: 60_000,
  })

  // B4: client-side filter over the already-loaded day set — status view first,
  // then the existing type filter. No extra fetch.
  const statusFiltered = useMemo(
    () =>
      incidents.filter((incident) =>
        statusView === 'active' ? isActiveStatus(incident.status) : incident.status === 'cleared',
      ),
    [incidents, statusView],
  )

  const activeSourceIncidents = statusView === 'calendar' ? calendarIncidents : statusFiltered

  const visibleIncidents = useMemo(() => {
    if (activeFilter === 'all') return activeSourceIncidents
    return activeSourceIncidents.filter((incident) => incident.type === activeFilter)
  }, [activeFilter, activeSourceIncidents])

  // Group counts over the full day set (independent of the type filter) so they
  // always add up to Total Today.
  const activeGroupCount = useMemo(
    () => incidents.filter((incident) => isActiveStatus(incident.status)).length,
    [incidents],
  )
  const clearedGroupCount = incidents.length - activeGroupCount

  // "Active Now" stat = strictly active (excludes expiring), as before.
  const activeCount = useMemo(
    () => incidents.filter((incident) => incident.status === 'active').length,
    [incidents],
  )

  const selectedIncident = useMemo(() => {
    if (!visibleIncidents.length) return null

    if (selectedIncidentId === NO_SELECTION) return null

    if (selectedIncidentId) {
      const matched = visibleIncidents.find((incident) => incident.id === selectedIncidentId)
      if (matched) return matched
    }

    return visibleIncidents[0] ?? null
  }, [selectedIncidentId, visibleIncidents])

  const handleMapClick = () => {
    setSelectedIncidentId(NO_SELECTION)
  }

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-primary px-6 text-center">
        <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-600">
          Missing VITE_MAPBOX_TOKEN in .env.local.
        </p>
      </div>
    )
  }

  return (
    <div className="relative mt-16 min-h-[calc(100dvh-4rem)] bg-bg-primary font-body text-body md:mt-0 md:h-screen md:w-screen md:overflow-hidden">
      <div className="relative z-0 h-[55dvh] min-h-[320px] md:absolute md:inset-0 md:h-full">
        <Map
          mapboxAccessToken={token}
          initialViewState={{
            longitude: 78.3772,
            latitude: 17.4435,
            zoom: 12,
          }}
          mapStyle={mapStyle}
          onClick={handleMapClick}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
        >
          {visibleIncidents.map((incident) => {
            const statusClasses = getStatusClasses(incident.status)
            const selected = selectedIncident?.id === incident.id
            return (
              <Marker
                key={incident.id}
                latitude={incident.lat}
                longitude={incident.lng}
                anchor="bottom"
              >
                <button
                  type="button"
                  aria-label={`${incident.type} at ${incident.location}`}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  onClick={(event) => {
                    event.stopPropagation()
                    setSelectedIncidentId(incident.id)
                  }}
                >
                  <IncidentPin
                    color={statusClasses.pin}
                    glow={statusClasses.glow}
                    selected={selected}
                    dimmed={false}
                  />
                </button>
              </Marker>
            )
          })}

          {selectedIncident ? (
            <Popup
              latitude={selectedIncident.lat}
              longitude={selectedIncident.lng}
              anchor="bottom"
              offset={36}
              closeButton={false}
              closeOnClick={false}
              maxWidth="320px"
              className="!z-[45]"
            >
              <div
                className={`w-[280px] overflow-hidden ${popupCardClass}`}
                style={{
                  background: 'rgba(255,255,255,0.82)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.7)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
                  borderRadius: '12px',
                }}
              >
                <div className="relative h-28 w-full border-b border-black/10">
                  {selectedIncident.photoUrl ? (
                    <img
                      alt="Incident snapshot"
                      className="h-full w-full object-cover"
                      src={selectedIncident.photoUrl}
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-200" />
                  )}
                </div>
                <div className="p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className={`font-headline text-headline ${panelItemPrimaryTextClass}`}>
                      {selectedIncident.location}
                    </h3>
                    <button
                      type="button"
                      className={`material-symbols-outlined unfilled text-[18px] ${panelItemPrimaryTextClass}`}
                      onClick={() => setSelectedIncidentId(NO_SELECTION)}
                    >
                      close
                    </button>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {getTypeTag(selectedIncident.type)}
                    </span>
                    <span className={`flex items-center gap-1 text-[11px] ${bodyTextClass}`}>
                      <span className="material-symbols-outlined text-[13px]">schedule</span>
                      {formatReceivedTime(selectedIncident.reportedAt)}
                    </span>
                  </div>
                  <p className={`mb-3 text-[13px] leading-relaxed ${bodyTextClass}`}>
                    {selectedIncident.rawMessage}
                  </p>
                  <div className="flex items-center justify-between rounded-lg border border-black/5 bg-white/35 p-2">
                    <div className="flex items-center gap-1 text-[12px] font-semibold text-color-orange">
                      <span className="material-symbols-outlined text-[14px]">timer</span>
                      {formatDelay(selectedIncident.delayMinutes)}
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold ${getStatusClasses(selectedIncident.status).badge}`}
                    >
                      {getStatusClasses(selectedIncident.status).label}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          ) : null}
        </Map>
      </div>

      <div className="absolute left-2 right-2 top-2 z-40 flex items-center gap-2 overflow-x-auto md:left-space-8 md:right-auto md:top-[76px] md:gap-space-3 md:overflow-visible">
        {FILTER_OPTIONS.map((filter) => {
          const isActive = activeFilter === filter.key
          return (
            <button
              key={filter.key}
              type="button"
              className="flex h-[40px] shrink-0 items-center gap-space-2 whitespace-nowrap rounded-[24px] px-4 font-subheadline text-subheadline shadow-[0_4px_12px_rgba(0,0,0,0.08)] md:h-[44px] md:px-space-5"
              style={
                isActive
                  ? { background: '#0071e3', border: '1px solid #0071e3', color: '#fff' }
                  : {
                      background: 'rgba(255,255,255,0.92)',
                      border: '1px solid rgba(0,113,227,0.35)',
                      color: '#0071e3',
                    }
              }
              onClick={() => setActiveFilter(filter.key)}
            >
              <span className="material-symbols-outlined text-[18px]" style={{ color: 'inherit' }}>
                {filter.icon}
              </span>
              <span className="live-legible-text" style={{ color: 'inherit' }}>
                {filter.label}
              </span>
            </button>
          )
        })}
      </div>

      <aside className="relative z-30 mx-2 mt-2 flex max-h-[36dvh] w-auto flex-col overflow-hidden rounded-[12px] md:absolute md:bottom-[108px] md:right-space-8 md:top-[76px] md:mx-0 md:mt-0 md:max-h-none md:w-[340px]">
        <div className={`flex h-full min-h-0 w-full flex-1 flex-col ${panelCardClass}`}>
          <div className="border-b border-black/10 p-space-4">
            <h2 className={`flex items-center gap-space-2 font-headline text-headline ${textClass}`}>
              <span className="material-symbols-outlined animate-pulse text-color-red">radar</span>
              Current Incidents
            </h2>

            <div
              className="mt-3 flex rounded-full p-1"
              style={{
                background: 'rgba(255,255,255,0.22)',
                border: '1px solid rgba(255,255,255,0.5)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {([
                { key: 'active', label: 'Active', count: activeGroupCount },
                { key: 'cleared', label: 'Cleared', count: clearedGroupCount },
                { key: 'calendar', label: 'Calendar', count: undefined as unknown as number, icon: 'calendar_month' },
              ] as Array<{ key: StatusView; label: string; count: number; icon?: string }>).map((view) => {
                const isActive = statusView === view.key
                return (
                  <button
                    key={view.key}
                    type="button"
                    aria-pressed={isActive}
                    className="flex flex-1 items-center justify-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors"
                    style={
                      isActive
                        ? { background: '#fff', color: '#0071e3', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }
                        : { background: 'transparent', color: 'rgba(255,255,255,0.92)' }
                    }
                    onClick={() => {
                      setStatusView(view.key)
                      setSelectedIncidentId(NO_SELECTION)
                    }}
                  >
                    {view.icon ? (
                      <span className="material-symbols-outlined text-[14px]" style={{ color: 'inherit' }}>
                        {view.icon}
                      </span>
                    ) : null}
                    {view.label}
                    {view.count !== undefined ? ` (${view.count})` : ''}
                  </button>
                )
              })}
            </div>
          </div>

          {statusView === 'calendar' ? (
            <div className="border-b border-black/10 px-space-3 py-space-2">
              <div className="mb-2 flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-white backdrop-blur-sm hover:bg-white/80"
                  onClick={() => setCalendarDate((d) => {
                    const next = new Date(d)
                    next.setDate(next.getDate() - 1)
                    return next
                  })}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-full bg-white/40 py-1.5 text-center text-[12px] font-semibold text-white backdrop-blur-sm"
                  onClick={() => setCalendarPickerOpen((o) => !o)}
                >
                  {calendarDate.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-white backdrop-blur-sm hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={calendarDate.toDateString() === new Date().toDateString()}
                  onClick={() => setCalendarDate((d) => {
                    const next = new Date(d)
                    next.setDate(next.getDate() + 1)
                    return next
                  })}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
              {calendarPickerOpen ? (
                <div className="mt-2 overflow-hidden rounded-xl border border-white/50 bg-white/80 p-2 shadow-lg backdrop-blur-xl">
                  <GlassDatePicker
                    selected={calendarDate}
                    onSelect={(d) => {
                      if (d) {
                        setCalendarDate(d)
                        setCalendarPickerOpen(false)
                      }
                    }}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          <div
            className="min-h-0 flex-1 space-y-space-2 overflow-y-auto p-space-3"
            style={{
              touchAction: 'pan-y',
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch',
            }}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
          >
            {(() => {
              const isCalendar = statusView === 'calendar'
              const loading = isCalendar ? calendarLoading : isLoading
              const errored = isCalendar ? calendarError : isError
              const dateLabel = calendarDate.toLocaleDateString(undefined, {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })

              if (loading) {
                return (
                  <p className={`px-2 py-3 font-subheadline text-subheadline ${textClass}`}>
                    {isCalendar
                      ? `Loading incidents for ${dateLabel}...`
                      : 'Loading incidents...'}
                  </p>
                )
              }
              if (errored) {
                return (
                  <p className={`px-2 py-3 font-subheadline text-subheadline ${textClass}`}>
                    Failed to load. Is the API running?
                  </p>
                )
              }
              if (!visibleIncidents.length) {
                return (
                  <p className={`px-2 py-3 font-subheadline text-subheadline ${textClass}`}>
                    {isCalendar
                      ? `No cleared incidents on ${dateLabel}.`
                      : statusView === 'cleared'
                        ? 'No cleared incidents today.'
                        : 'No active incidents right now.'}
                  </p>
                )
              }
              return null
            })()}

            {!isLoading &&
              !isError &&
              visibleIncidents.map((incident) => {
                const statusClasses = getStatusClasses(incident.status)
                const selected = selectedIncident?.id === incident.id

                return (
                  <button
                    key={incident.id}
                    type="button"
                    className={`relative w-full overflow-hidden rounded-[12px] border p-space-3 text-left transition-colors ${
                      selected
                        ? 'border-black/15 bg-white shadow-[0_6px_14px_rgba(0,0,0,0.08)]'
                        : 'border-black/10 bg-white/95 hover:border-black/20 hover:bg-white'
                    }`}
                    onClick={() => setSelectedIncidentId(incident.id)}
                  >
                    <div
                      className={`absolute left-0 top-0 h-full w-1 ${
                        incident.status === 'active'
                          ? 'bg-color-red'
                          : incident.status === 'expiring'
                            ? 'bg-color-orange'
                            : 'bg-color-green'
                      }`}
                    />
                    <div className="mb-2 flex items-start justify-between pl-2">
                      <span className={`live-legible-text font-subheadline text-subheadline font-semibold ${panelItemPrimaryTextClass}`}>
                        {incident.location}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusClasses.badge}`}
                      >
                        {statusClasses.label}
                      </span>
                    </div>
                    <p className={`mb-2 pl-2 font-footnote text-footnote ${bodyTextClass}`}>
                      {incident.description}
                    </p>
                    <div className="flex items-center justify-between pl-2">
                      <div className="flex items-center gap-1 text-[12px] font-semibold text-color-orange">
                        <span className={`material-symbols-outlined text-[14px] ${getTypeColor(incident.type)}`}>
                          {getTypeIcon(incident.type)}
                        </span>
                        <span>{formatDelay(incident.delayMinutes)}</span>
                      </div>
                      <span className={`flex items-center gap-1 text-[12px] ${panelItemPrimaryTextClass}`}>
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {formatReceivedTime(incident.reportedAt)}
                      </span>
                    </div>
                  </button>
                )
              })}
          </div>
        </div>
      </aside>

      <div className="relative z-30 m-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:absolute md:bottom-space-8 md:left-space-8 md:right-[390px] md:m-0 md:flex md:h-[68px] md:items-stretch md:justify-start md:gap-space-3 md:rounded-[12px]">
        <div className={`flex min-w-0 w-full items-center gap-space-3 px-space-4 py-3 md:w-fit md:min-w-[160px] md:py-0 ${statsCardClass}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-color-red/25 bg-color-red/10 text-color-red">
            <span className="material-symbols-outlined text-[18px]">warning</span>
          </div>
          <div>
            <div className={`font-caption-1 text-caption-1 uppercase tracking-wider ${statsTextClass}`}>
              Active Now
            </div>
            <div className={`live-legible-text font-title-2 text-title-2 font-bold ${statsTextClass}`}>
              {activeCount}
            </div>
          </div>
        </div>

        <div className={`flex min-w-0 w-full items-center gap-space-3 px-space-4 py-3 md:w-fit md:min-w-[160px] md:py-0 ${statsCardClass}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          </div>
          <div>
            <div className={`font-caption-1 text-caption-1 uppercase tracking-wider ${statsTextClass}`}>
              Total Today
            </div>
            <div className={`live-legible-text font-title-2 text-title-2 font-bold ${statsTextClass}`}>
              {incidents.length}
            </div>
          </div>
        </div>

        <div className={`flex min-w-0 w-full items-center gap-space-3 px-space-4 py-3 md:w-fit md:min-w-[160px] md:py-0 ${statsCardClass}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-color-orange/25 bg-color-orange/10 text-color-orange">
            <span className="material-symbols-outlined text-[18px]">map</span>
          </div>
          <div>
            <div className={`font-caption-1 text-caption-1 uppercase tracking-wider ${statsTextClass}`}>
              Focus Junction
            </div>
            <div className={`live-legible-text font-headline text-headline font-semibold ${statsTextClass}`}>
              {selectedIncident ? selectedIncident.location : '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
