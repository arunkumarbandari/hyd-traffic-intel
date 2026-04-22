import { useMemo, useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'

type IncidentStatus = 'active' | 'expiring' | 'cleared'
type IncidentType = 'breakdown' | 'congestion' | 'accident'

type Incident = {
  id: string
  lat: number
  lng: number
  status: IncidentStatus
  type: IncidentType
  location: string
}

const MOCK_INCIDENTS: Incident[] = [
  {
    id: '1',
    lat: 17.4448,
    lng: 78.3498,
    status: 'active',
    type: 'breakdown',
    location: 'Wipro Junction',
  },
  {
    id: '2',
    lat: 17.4477,
    lng: 78.3805,
    status: 'expiring',
    type: 'congestion',
    location: 'Hitech City Signal',
  },
  {
    id: '3',
    lat: 17.4258,
    lng: 78.3631,
    status: 'active',
    type: 'accident',
    location: 'Raidurg Flyover',
  },
  {
    id: '4',
    lat: 17.4401,
    lng: 78.3489,
    status: 'cleared',
    type: 'breakdown',
    location: 'Gachibowli Circle',
  },
]

const INCIDENT_DETAILS: Record<IncidentType, { summary: string; delay: string; tag: string }> = {
  accident: {
    summary: 'Multi-vehicle collision. Emergency response active.',
    delay: '~45 min delay',
    tag: 'Collision',
  },
  congestion: {
    summary: 'Severe queue build-up on the corridor. Flow control in effect.',
    delay: '~25 min delay',
    tag: 'Congestion',
  },
  breakdown: {
    summary: 'Vehicle breakdown reported. Partial lane obstruction.',
    delay: '~15 min delay',
    tag: 'Breakdown',
  },
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

export default function LiveMapPage() {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(MOCK_INCIDENTS[0])
  const mapStyle = 'mapbox://styles/mapbox/navigation-day-v1'

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

  const activeCount = useMemo(
    () => MOCK_INCIDENTS.filter((incident) => incident.status === 'active').length,
    [],
  )

  const handleMapClick = () => {
    setSelectedIncident(null)
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
    <div className="relative h-screen w-screen overflow-hidden bg-bg-primary font-body text-body">
      <div className="absolute inset-0 z-0">
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
          {MOCK_INCIDENTS.map((incident) => {
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
                    setSelectedIncident(incident)
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
                  <img
                    alt="Incident snapshot"
                    className="h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO3_aACL4Nuz9DLdpbpbQffr_MJbZpGqU6Pae9KThs6mZj3a953Esy41wFc_qXu4EZ8ZgiToUgTAFunZX4A4nIRXUi5Sl6QNmpP0myBvd2-jsAisZ_MCqZfxM0c7sOB8Rc2Ky1S_QE4R6MurzRBB26YZdiTA12dkLJcV0qC45u1PxHVnZys5UWEs-HgQTxy8jndDTr5lVBsMsVMov3o-TgEuzG12MF9K5wRWVOOfrmCj0KfbF_KSzPMx20aWOxqIFOTy8mmHQs8v9x"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                    <span className="rounded bg-black/65 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {INCIDENT_DETAILS[selectedIncident.type].tag}
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
                      onClick={() => setSelectedIncident(null)}
                    >
                      close
                    </button>
                  </div>
                  <p className={`mb-3 text-[13px] leading-relaxed ${bodyTextClass}`}>
                    {INCIDENT_DETAILS[selectedIncident.type].summary}
                  </p>
                  <div className="flex items-center justify-between rounded-lg border border-black/5 bg-white/35 p-2">
                    <div className="flex items-center gap-1 text-[12px] font-semibold text-color-orange">
                      <span className="material-symbols-outlined text-[14px]">timer</span>
                      {INCIDENT_DETAILS[selectedIncident.type].delay}
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

      <div className="absolute left-space-8 top-[76px] z-40 flex items-center gap-space-3">
        <button
          className={`flex h-[44px] items-center gap-space-2 rounded-[24px] px-space-5 font-subheadline text-subheadline ${chipCardClass} ${activeChipClass}`}
        >
          <span className={`material-symbols-outlined text-[18px] ${chipIconActiveClass}`}>emergency</span>
          <span className={`live-legible-text ${chipActiveTextClass}`}>All Incidents</span>
        </button>
        <button
          className={`flex h-[44px] items-center gap-space-2 rounded-[24px] px-space-5 font-subheadline text-subheadline ${chipCardClass}`}
        >
          <span className={`material-symbols-outlined text-[18px] ${chipIconInactiveClass}`}>car_crash</span>
          <span className={`live-legible-text ${chipInactiveTextClass}`}>Accidents</span>
        </button>
        <button
          className={`flex h-[44px] items-center gap-space-2 rounded-[24px] px-space-5 font-subheadline text-subheadline ${chipCardClass}`}
        >
          <span className={`material-symbols-outlined text-[18px] ${chipIconInactiveClass}`}>traffic</span>
          <span className={`live-legible-text ${chipInactiveTextClass}`}>Congestion</span>
        </button>
      </div>

      <aside className="absolute bottom-[108px] right-space-8 top-[76px] z-40 flex w-[340px] flex-col overflow-hidden rounded-[12px]">
        <div className={`flex h-full w-full flex-col ${panelCardClass}`}>
          <div className="border-b border-black/10 p-space-4">
            <h2 className={`flex items-center gap-space-2 font-headline text-headline ${textClass}`}>
              <span className="material-symbols-outlined animate-pulse text-color-red">radar</span>
              Current Incidents
            </h2>
          </div>

          <div className="flex-1 space-y-space-2 overflow-y-auto p-space-3">
            {MOCK_INCIDENTS.map((incident) => {
              const details = INCIDENT_DETAILS[incident.type]
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
                  onClick={() => setSelectedIncident(incident)}
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
                    {details.summary}
                  </p>
                  <div className="flex items-center justify-between pl-2">
                    <div className="flex items-center gap-1 text-[12px] font-semibold text-color-orange">
                      <span className={`material-symbols-outlined text-[14px] ${getTypeColor(incident.type)}`}>
                        {getTypeIcon(incident.type)}
                      </span>
                      <span>{details.delay}</span>
                    </div>
                    <span className={`text-[12px] ${panelItemPrimaryTextClass}`}>{incident.id}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </aside>

      <div className="absolute bottom-space-8 left-space-8 right-[390px] z-40 flex h-[68px] items-stretch justify-start gap-space-3 rounded-[12px]">
        <div className={`flex w-fit min-w-[160px] items-center gap-space-3 px-space-4 ${statsCardClass}`}>
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

        <div className={`flex w-fit min-w-[160px] items-center gap-space-3 px-space-4 ${statsCardClass}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          </div>
          <div>
            <div className={`font-caption-1 text-caption-1 uppercase tracking-wider ${statsTextClass}`}>
              Total Tracked
            </div>
            <div className={`live-legible-text font-title-2 text-title-2 font-bold ${statsTextClass}`}>
              {MOCK_INCIDENTS.length}
            </div>
          </div>
        </div>

        <div className={`flex w-fit min-w-[160px] items-center gap-space-3 px-space-4 ${statsCardClass}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-color-orange/25 bg-color-orange/10 text-color-orange">
            <span className="material-symbols-outlined text-[18px]">map</span>
          </div>
          <div>
            <div className={`font-caption-1 text-caption-1 uppercase tracking-wider ${statsTextClass}`}>
              Focus Junction
            </div>
            <div className={`live-legible-text font-headline text-headline font-semibold ${statsTextClass}`}>
              {selectedIncident ? selectedIncident.location : 'Hitech City'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
