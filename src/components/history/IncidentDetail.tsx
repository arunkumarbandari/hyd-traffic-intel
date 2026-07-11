import type { IncidentRow, IncidentStatus, IncidentType } from '../../api/incidents'

export function formatStatusLabel(status: IncidentStatus) {
  if (status === 'active') return 'Active'
  if (status === 'expiring') return 'Expiring'
  return 'Cleared'
}

export function getStatusClasses(status: IncidentStatus) {
  if (status === 'cleared') {
    return 'bg-color-green/10 text-color-green-dark border-color-green/20'
  }

  if (status === 'expiring') {
    return 'bg-color-orange/12 text-color-orange border-color-orange/25'
  }

  return 'bg-color-red/10 text-color-red border-color-red/20'
}

export function getTypeLabel(type: IncidentType) {
  if (type === 'accident') return 'Accident'
  if (type === 'congestion') return 'Congestion'
  if (type === 'roadwork') return 'Roadwork'
  if (type === 'other') return 'Other'
  return 'Breakdown'
}

export function getTypeIcon(type: IncidentType) {
  if (type === 'accident') return 'car_crash'
  if (type === 'congestion') return 'traffic'
  if (type === 'roadwork') return 'construction'
  if (type === 'other') return 'report'
  return 'build'
}

export function getTypeIconColor(type: IncidentType) {
  if (type === 'accident') return 'text-color-orange'
  if (type === 'congestion') return 'text-color-red'
  if (type === 'roadwork') return 'text-primary'
  if (type === 'other') return 'text-color-purple'
  return 'text-color-teal'
}

export function IncidentDetailHeader({
  incident,
  onDismiss,
  dismissIcon,
}: {
  incident: IncidentRow | undefined
  onDismiss: () => void
  dismissIcon: 'close' | 'arrow_back'
}) {
  return (
    <div className="z-10 flex items-start justify-between bg-gradient-to-b from-white/50 to-transparent px-space-6 pb-space-4 pt-space-6">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            ID: {incident?.id ?? '—'}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 font-caption-2 text-caption-2 font-medium ${
              incident ? getStatusClasses(incident.status) : 'border-outline-variant/50 text-label-secondary'
            }`}
          >
            {incident ? formatStatusLabel(incident.status) : '—'}
          </span>
        </div>
        <h2 className="mt-1 font-title-2 text-title-2 leading-tight text-label-primary">
          {incident?.location_name ?? 'Select an incident'}
        </h2>
        <p className="mt-1 font-subheadline text-subheadline text-label-secondary">
          {incident ? new Date(incident.reported_at).toLocaleString() : '—'}
        </p>
      </div>

      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-label-secondary transition-colors hover:bg-surface-variant"
        onClick={onDismiss}
      >
        <span className="material-symbols-outlined text-[20px]">{dismissIcon}</span>
      </button>
    </div>
  )
}

export function IncidentDetailBody({
  incident,
  onPhotoClick,
}: {
  incident: IncidentRow | undefined
  onPhotoClick: () => void
}) {
  return (
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
            {incident?.raw_message ?? '—'}
          </p>
          <div className="mt-2 flex items-center justify-between font-caption-2 text-caption-2 text-label-secondary">
            <span>~ {incident?.source ?? '—'}</span>
            <span>
              {incident ? new Date(incident.reported_at).toLocaleString() : '—'}
            </span>
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

        {incident?.photo_url ? (
          <div
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-outline-variant/30 shadow-sm"
            onClick={onPhotoClick}
          >
            <img
              alt="Traffic incident evidence"
              className="h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={incident.photo_url}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
              <span className="material-symbols-outlined text-[32px] text-white opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100">
                zoom_in
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-space-2 rounded-xl border border-outline-variant/30 bg-white/40 p-space-4">
        <p className="font-subheadline text-subheadline text-label-primary">
          <span className="font-semibold">Clean message:</span> {incident?.clean_message ?? '—'}
        </p>
        <p className="font-subheadline text-subheadline text-label-primary">
          <span className="font-semibold">Type:</span>{' '}
          {incident ? getTypeLabel(incident.incident_type) : '—'}
        </p>
        <p className="font-subheadline text-subheadline text-label-primary">
          <span className="font-semibold">Status:</span>{' '}
          {incident ? formatStatusLabel(incident.status) : '—'}
        </p>
        <p className="font-subheadline text-subheadline text-label-primary">
          <span className="font-semibold">Reported at:</span>{' '}
          {incident ? new Date(incident.reported_at).toLocaleString() : '—'}
        </p>
        <p className="font-subheadline text-subheadline text-label-primary">
          <span className="font-semibold">Expires at:</span>{' '}
          {incident ? new Date(incident.expires_at).toLocaleString() : '—'}
        </p>
        <p className="font-subheadline text-subheadline text-label-primary">
          <span className="font-semibold">Estimated delay:</span>{' '}
          {incident ? `${incident.estimated_minutes} min` : '—'}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-subheadline text-subheadline font-semibold text-label-primary">
            Parsed by:
          </span>
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-caption-2 text-caption-2 font-medium text-primary">
            {incident?.parsed_by ?? '—'}
          </span>
        </div>
        <p className="font-subheadline text-subheadline text-label-primary">
          <span className="font-semibold">Source:</span> {incident?.source ?? '—'}
        </p>
      </div>
    </div>
  )
}
