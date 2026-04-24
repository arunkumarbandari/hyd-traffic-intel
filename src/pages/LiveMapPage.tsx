import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import { fetchIncidents, type IncidentRow, type IncidentStatus, type IncidentType } from '../api/incidents'

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
}

type LiveFilterType = 'all' | IncidentType

const FILTER_OPTIONS: Array<{ key: LiveFilterType; label: string; icon: string }> = [
  { key: 'all', label: 'All Incidents', icon: 'emergency' },
  { key: 'accident', label: 'Accidents', icon: 'car_crash' },
  { key: 'congestion', label: 'Congestion', icon: 'traffic' },
]

const NO_SELECTION = '__none__'

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
  }
}

function getStatusClasses(status: IncidentStatus) {
  if (status === 'active') {
    return {
      pin: 'bg-[#FF3B30] shadow-[0_0_18px_#FF3B30]',
      badge: 'bg-color-red/10 text-color-red',
      label: 'Active',
    }
  }

  if (status === 'expiring') {
    return {
      pin: 'bg-[#FF9500] shadow-[0_0_18px_#FF9500]',
      badge: 'bg-color-orange/10 text-color-orange',
      label: 'Expiring',
    }
  }

  return {
    pin: 'bg-[rgba(52,199,89,0.85)]',
    badge: 'bg-color-green/18 text-color-green-dark',
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

  const panelCardClass = 'live-orange-panel-glass'
  const statsCardClass = 'live-blue-stats-card'
  const chipCardClass = 'live-blue-chip'
  const activeChipClass = 'live-blue-chip-active'
  const textClass = 'text-white'
  const bodyTextClass = 'text-slate-600'
  const panelItemPrimaryTextClass = 'text-slate-900'
  const chipActiveTextClass = 'text-white'
  const chipInactiveTextClass = 'text-[#0071e3]'
  const statsTextClass = 'text-white'
  const chipIconActiveClass = 'text-white'
  const chipIconInactiveClass = 'text-[#0071e3]'
  const popupCardClass = 'live-blue-glass-card'

  const { data: incidents = [], isLoading, isError } = useQuery({
    queryKey: ['incidents', 'live'],
    queryFn: () => fetchIncidents({ status: 'active,expiring', today: 'true' }),
    refetchInterval: 30_000,
    staleTime: 20_000,
    select: (response) => (response.data ?? []).map(mapIncident),
  })

  const visibleIncidents = useMemo(() => {
    if (activeFilter === 'all') return incidents
    return incidents.filter((incident) => incident.type === activeFilter)
  }, [activeFilter, incidents])

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
            return (
              <Marker
                key={incident.id}
                latitude={incident.lat}
                longitude={incident.lng}
                anchor="center"
              >
                <button
                  type="button"
                  aria-label={`${incident.type} at ${incident.location}`}
                  className={`h-7 w-7 rounded-full border-2 border-white transition-transform hover:scale-105 ${statusClasses.pin}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    setSelectedIncidentId(incident.id)
                  }}
                />
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
              <div className={`w-[280px] overflow-hidden ${popupCardClass}`}>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                    <span className="rounded bg-black/65 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {getTypeTag(selectedIncident.type)}
                    </span>
                    <span className="rounded bg-white/75 px-2 py-1 text-[10px] font-semibold text-slate-700">
                      {selectedIncident.location}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className={`live-legible-text font-headline text-headline ${panelItemPrimaryTextClass}`}>
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
              className={`flex h-[40px] shrink-0 items-center gap-space-2 whitespace-nowrap rounded-[24px] px-4 font-subheadline text-subheadline md:h-[44px] md:px-space-5 ${chipCardClass} ${
                isActive ? activeChipClass : ''
              }`}
              onClick={() => setActiveFilter(filter.key)}
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isActive ? chipIconActiveClass : chipIconInactiveClass
                }`}
              >
                {filter.icon}
              </span>
              <span className={`live-legible-text ${isActive ? chipActiveTextClass : chipInactiveTextClass}`}>
                {filter.label}
              </span>
            </button>
          )
        })}
      </div>

      <aside className="relative z-30 mx-2 mt-2 flex max-h-[36dvh] w-auto flex-col overflow-hidden rounded-[12px] md:absolute md:bottom-[108px] md:right-space-8 md:top-[76px] md:mx-0 md:mt-0 md:max-h-none md:w-[340px]">
        <div className={`flex h-full w-full flex-col ${panelCardClass}`}>
          <div className="border-b border-black/10 p-space-4">
            <h2 className={`flex items-center gap-space-2 font-headline text-headline ${textClass}`}>
              <span className="material-symbols-outlined animate-pulse text-color-red">radar</span>
              Current Incidents
            </h2>
          </div>

          <div className="flex-1 space-y-space-2 overflow-y-auto p-space-3">
            {isLoading ? (
              <p className={`px-2 py-3 font-subheadline text-subheadline ${textClass}`}>
                Loading incidents...
              </p>
            ) : null}

            {isError ? (
              <p className={`px-2 py-3 font-subheadline text-subheadline ${textClass}`}>
                Failed to load. Is the API running?
              </p>
            ) : null}

            {!isLoading && !isError && !visibleIncidents.length ? (
              <p className={`px-2 py-3 font-subheadline text-subheadline ${textClass}`}>
                No active incidents right now.
              </p>
            ) : null}

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
                            : 'bg-slate-500'
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
                      <span className={`text-[12px] ${panelItemPrimaryTextClass}`}>{incident.id}</span>
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
